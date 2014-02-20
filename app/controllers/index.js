var Moment = require('alloy/moment'),	// Alloyにビルトインされている
	Alert = require('alloy/alert'),		// app/assets/alloy/alert.jsに用意
	Dialogs = require('alloy/dialogs');	// Alloyにビルトインされている

// TODOコレクションを取得
var todos = Alloy.Collections.todos;
// 未完了・完了・全てフィルタ用
var done = 0;
// Ti.UI.RefreshControl用
var control;

// dataTransform用の関数
function doTransform(_model) {
	var json = _model.toJSON();
	json.created_at = Moment(json.created_at).format('YYYY-MM-DD HH:mm');
	return json;
}

// dataFilter用の関数
function doFilter(_collection) {
	return _collection.filter(function(_predicate){
		var json = _predicate.toJSON();

		if (json.deleted_at !== '0000-00-00 00:00:00') {
			// 削除日付が入っていたら問答無用でfalseを返却
			return false;
		} else if (done === 2) {
			// doneが2（すべて表示）の場合は問答無用でtrueを返却
			return true;
		} else {
			return parseInt(json.done, 10) === done;
		}
	});
}

// タブをタップした際のコールバック関数
function doTab(e) {
	done = e.index;		// 未完了・完了・全てフィルタを更新
	todos.fetch();		// TODOコレクションを再フェッチ
}

// アクションバーのメニューをタップした際のコールバック関数
function doIncomplete() {
	doTab({				// 未完了
		index: 0
	});
}

function doComplete() {
	doTab({				// 完了
		index: 1
	});
}

function doAll() {
	doTab({				// 全て
		index: 2
	});
}

// タスク登録ボタンをタップした際のコールバック関数
function doAddtask() {
	// 入力チェック
	if ($.textfield.getValue() === '') {
		Alert.dialog({
			title: 'エラー',
			message: '新しいタスクを入力してください'
		});
		return;
	}

	// 新規のタスクモデルを生成
	var task = Alloy.createModel('todos', {
		task: $.textfield.getValue(),
		created_at: Moment().format('YYYY-MM-DD HH:mm:ss')
	});
	todos.add(task);	// TODOコレクションへ追加
	task.save();		// タスクモデルを保存
	todos.fetch();		// TODOコレクションを再フェッチ
}

// iOSの場合のみの処理（OS_IOSはAlloyで定義されている）
if (OS_IOS) {
	// AlloyのTi.UI.RefreshControlサポートは1.4.0からの予定なので、
	// 今回はビューに書けない（この時点での最新版は1.3.1）
	control = Ti.UI.createRefreshControl();
	control.addEventListener('refreshstart', function(){
		todos.fetch({
			success: function(){
				control.endRefreshing();
			}
		});
	});

	$.table.applyProperties({
		refreshControl: control
	});
}

// 長押しイベントを登録（削除）
$.table.addEventListener('longpress', function(e){
	if (e.rowData && e.rowData.taskid) {
		Dialogs.confirm({
			title: '確認',
			message: 'タスクを削除してもよろしいですか？',
			buttonNames: ['削除', 'キャンセル'],
			cancel: 1,
			callback: function(){
				var task = todos.get(e.rowData.taskid);
				task.set({		// 削除日付をセット
					deleted_at: Moment().format('YYYY-MM-DD HH:mm:ss')
				});
				task.save();	// タスクモデルを保存
				todos.fetch();	// TODOコレクションをフェッチ
			}
		});
	}
});

// スワイプイベントを登録（完了/未完了）
$.table.addEventListener('swipe', function(e){
	if (e.rowData && e.rowData.taskid) {
		var task = todos.get(e.rowData.taskid),
			json = task.toJSON(),
			done = parseInt(json.done, 10);

		Dialogs.confirm({
			title: '確認',
			message: done ? 'タスクを未完了に戻しますか？' : 'タスクを完了してもよろしいですか？',
			buttonNames: [done ? '戻す' : '完了', 'キャンセル'],
			cancel: 1,
			callback: function(){
				task.set({		// 完了・未完了フラグを反転
					done: done === 0 ? 1 : 0
				});
				task.save();	// タスクモデルを保存
				todos.fetch();	// TODOコレクションをフェッチ
			}
		});
	}
});

$.index.addEventListener('open', function(){
	todos.fetch();		// ウィンドウが開かれたらTODOコレクションをフェッチ
});

$.index.open();