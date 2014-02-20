var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.CFG.TextFieldWidth = Ti.Platform.displayCaps.platformWidth - 59;

Alloy.Collections.todos = Alloy.createCollection("todos");

Alloy.createController("index");