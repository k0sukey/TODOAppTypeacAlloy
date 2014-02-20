function Controller() {
    function __alloyId8(e) {
        if (e && e.fromAdapter) return;
        __alloyId8.opts || {};
        var models = doFilter(__alloyId7);
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId2 = models[i];
            __alloyId2.__transform = doTransform(__alloyId2);
            var __alloyId4 = Ti.UI.createTableViewRow({
                width: Ti.UI.FILL,
                height: 44,
                taskid: "undefined" != typeof __alloyId2.__transform["id"] ? __alloyId2.__transform["id"] : __alloyId2.get("id")
            });
            rows.push(__alloyId4);
            var __alloyId5 = Ti.UI.createLabel({
                top: 4,
                left: 15,
                color: "#000",
                text: "undefined" != typeof __alloyId2.__transform["task"] ? __alloyId2.__transform["task"] : __alloyId2.get("task")
            });
            __alloyId4.add(__alloyId5);
            var __alloyId6 = Ti.UI.createLabel({
                bottom: 4,
                left: 15,
                color: "#ccc",
                font: {
                    fontSize: 12
                },
                text: "undefined" != typeof __alloyId2.__transform["created_at"] ? __alloyId2.__transform["created_at"] : __alloyId2.get("created_at")
            });
            __alloyId4.add(__alloyId6);
        }
        $.__views.table.setData(rows);
    }
    function doTransform(_model) {
        var json = _model.toJSON();
        json.created_at = Moment(json.created_at).format("YYYY-MM-DD HH:mm");
        return json;
    }
    function doFilter(_collection) {
        return _collection.filter(function(_predicate) {
            var json = _predicate.toJSON();
            return "0000-00-00 00:00:00" !== json.deleted_at ? false : 2 === done ? true : parseInt(json.done, 10) === done;
        });
    }
    function doTab(e) {
        done = e.index;
        todos.fetch();
    }
    function doAddtask() {
        if ("" === $.textfield.getValue()) {
            Alert.dialog({
                title: "エラー",
                message: "新しいタスクを入力してください"
            });
            return;
        }
        var task = Alloy.createModel("todos", {
            task: $.textfield.getValue(),
            created_at: Moment().format("YYYY-MM-DD HH:mm:ss")
        });
        todos.add(task);
        task.save();
        todos.fetch();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.__alloyId0 = Ti.UI.createWindow({
        backgroundColor: "white",
        title: "myTODO",
        id: "__alloyId0"
    });
    $.__views.addtask = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: 44,
        id: "addtask"
    });
    $.__views.textfield = Ti.UI.createTextField({
        left: 15,
        width: Alloy.CFG.TextFieldWidth,
        height: 44,
        id: "textfield",
        hintText: "New task"
    });
    $.__views.addtask.add($.__views.textfield);
    $.__views.addbutton = Ti.UI.createButton({
        right: 0,
        width: 44,
        height: 44,
        title: "登録",
        id: "addbutton"
    });
    $.__views.addtask.add($.__views.addbutton);
    doAddtask ? $.__views.addbutton.addEventListener("click", doAddtask) : __defers["$.__views.addbutton!click!doAddtask"] = true;
    $.__views.table = Ti.UI.createTableView({
        top: 0,
        right: 0,
        bottom: 44,
        left: 0,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        headerView: $.__views.addtask,
        id: "table"
    });
    $.__views.__alloyId0.add($.__views.table);
    var __alloyId7 = Alloy.Collections["todos"] || todos;
    __alloyId7.on("fetch destroy change add remove reset", __alloyId8);
    $.__views.footer = Ti.UI.createView({
        right: 0,
        bottom: 0,
        left: 0,
        width: Ti.UI.FILL,
        height: 44,
        backgroundColor: "#fff",
        id: "footer"
    });
    $.__views.__alloyId0.add($.__views.footer);
    var __alloyId10 = [];
    var __alloyId14 = {
        title: "未完了",
        ns: "Alloy.Abstract"
    };
    __alloyId10.push(__alloyId14);
    var __alloyId15 = {
        title: "完了",
        ns: "Alloy.Abstract"
    };
    __alloyId10.push(__alloyId15);
    var __alloyId16 = {
        title: "全て",
        ns: "Alloy.Abstract"
    };
    __alloyId10.push(__alloyId16);
    $.__views.tab = Ti.UI.iOS.createTabbedBar({
        index: 0,
        style: Ti.UI.iPhone.SystemButtonStyle.BAR,
        labels: __alloyId10,
        id: "tab"
    });
    $.__views.footer.add($.__views.tab);
    doTab ? $.__views.tab.addEventListener("click", doTab) : __defers["$.__views.tab!click!doTab"] = true;
    $.__views.index = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.__alloyId0,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {
        __alloyId7.off("fetch destroy change add remove reset", __alloyId8);
    };
    _.extend($, $.__views);
    var Moment = require("alloy/moment"), Alert = require("alloy/alert"), Dialogs = require("alloy/dialogs");
    var todos = Alloy.Collections.todos;
    var done = 0;
    var control;
    control = Ti.UI.createRefreshControl();
    control.addEventListener("refreshstart", function() {
        todos.fetch({
            success: function() {
                control.endRefreshing();
            }
        });
    });
    $.table.applyProperties({
        refreshControl: control
    });
    $.index.addEventListener("open", function() {
        todos.fetch();
    });
    $.table.addEventListener("longpress", function(e) {
        e.rowData && e.rowData.taskid && Dialogs.confirm({
            title: "確認",
            message: "タスクを削除してもよろしいですか？",
            buttonNames: [ "削除", "キャンセル" ],
            cancel: 1,
            callback: function() {
                var task = todos.get(e.rowData.taskid);
                task.set({
                    deleted_at: Moment().format("YYYY-MM-DD HH:mm:ss")
                });
                task.save();
                todos.fetch();
            }
        });
    });
    $.table.addEventListener("swipe", function(e) {
        if (e.rowData && e.rowData.taskid) {
            var task = todos.get(e.rowData.taskid), json = task.toJSON(), done = parseInt(json.done, 10);
            Dialogs.confirm({
                title: "確認",
                message: done ? "タスクを未完了に戻しますか？" : "タスクを完了してもよろしいですか？",
                buttonNames: [ done ? "戻す" : "完了", "キャンセル" ],
                cancel: 1,
                callback: function() {
                    task.set({
                        done: !done
                    });
                    task.save();
                    todos.fetch();
                }
            });
        }
    });
    $.index.open();
    __defers["$.__views.addbutton!click!doAddtask"] && $.__views.addbutton.addEventListener("click", doAddtask);
    __defers["$.__views.tab!click!doTab"] && $.__views.tab.addEventListener("click", doTab);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;