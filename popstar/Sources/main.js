/**
 * @GameName :
 * popstar
 *
 * @DevelopTool:
 * Cocos2d-x Editor (CocosEditor)
 *
 * @time
 * 2014-02-23 pm
 *
 * @Licensed:
 * This showcase is licensed under GPL.
 *
 * @Authors:
 * Programmer: touchSnow
 *
 * @Links:
 * http://www.cocos2d-x.com/ (cocos官方)
 * https://github.com/makeapp      （github）
 * http://blog.csdn.net/touchsnow (csdn博客)
 * http://blog.makeapp.co/ （官方博客）
 * http://www.cocoseditor.com/ （建设中官网）
 *
 * @Contact
 * 邮箱：zuowen@makeapp.co
 * qq群：232361142
 *
 */

if (sys.platform == 'browser') {
    var require = function (file)
    {
        var d = document;
        var s = d.createElement('script');
        s.src = file;
        d.body.appendChild(s);
    }
}
else {
    require("jsb.js");
}

cc.debug = function (msg)
{
    cc.log(msg);
}

cc.BuilderReader.replaceScene = function (path, ccbName)
{
    var scene = cc.BuilderReader.loadAsSceneFrom(path, ccbName);
    cc.Director.getInstance().replaceScene(scene);
    return scene;
}

cc.BuilderReader.loadAsScene = function (file, owner, parentSize)
{
    var node = cc.BuilderReader.load(file, owner, parentSize);
    var scene = cc.Scene.create();
    scene.addChild(node);
    return scene;
};

cc.BuilderReader.loadAsSceneFrom = function (path, ccbName)
{
    if (path && path.length > 0) {
        cc.BuilderReader.setResourcePath(path + "/");
        return cc.BuilderReader.loadAsScene(path + "/" + ccbName);
    }
    else {
        return cc.BuilderReader.loadAsScene(ccbName);
    }
}

cc.BuilderReader.loadAsNodeFrom = function (path, ccbName, owner)
{
    if (path && path.length > 0) {
        cc.BuilderReader.setResourcePath(path + "/");
        return cc.BuilderReader.load(path + "/" + ccbName, owner);
    }
    else {
        return cc.BuilderReader.load(ccbName, owner);
    }
}

cc.BuilderReader.runScene = function (module, name)
{
    var director = cc.Director.getInstance();
    var scene = cc.BuilderReader.loadAsSceneFrom(module, name);
    var runningScene = director.getRunningScene();
    if (runningScene === null) {
        cc.log("runWithScene");
        director.runWithScene(scene);
    }
    else {
        cc.log("replaceScene");
        director.replaceScene(scene);
    }
}

cc.CleanUp = {};
cc.CleanUp.create = function (sprite)
{
    return cc.CallFunc.create(function ()
    {
        sprite.cleanuped = true;
        sprite.removeFromParent(true);
    });
}

cc.StarParticle = {};
cc.StarParticle.create = function (node, x, y, name)
{
    var particle = cc.ParticleSystem.create("Resources/particles/" + name + ".plist");
    particle.setAnchorPoint(cc.p(0.5, 0.5));
    particle.setPosition(cc.p(x, y));
    particle.setZOrder(120);
    node.addChild(particle);
    return particle;
};

cc.StarLabel = {};
cc.StarLabel.createScore = function (node, p, message)
{
    var label = cc.LabelTTF.create(message, "Arial", 30);
    label.setPosition(p);
    label.setColor(cc.c3b(255, 255, 255));
    label.setZOrder(10000);
    node.addChild(label);
    return label;
};

cc.StarLabel.createTip = function (node, p, message)
{
    var label = cc.LabelTTF.create(message, "Arial", 30);
    label.setPosition(p);
    label.setColor(cc.c3b(255, 255, 255));
    label.setZOrder(10000);
    node.addChild(label);
    return label;
};

cc.Toast = {};
cc.Toast.create = function (node, message, delay)
{
    cc.log("toast");
    var director = cc.Director.getInstance();
    var size = director.getWinSize();
    var label = cc.LabelTTF.create(message, "Arial", 40);
    label.setPosition(size.width / 2, size.height / 2 + 100);
    label.setColor(cc.c3b(255, 255, 255));
    label.setZOrder(10000);
    node.addChild(label);
    label.runAction(cc.Sequence.create(cc.DelayTime.create(delay), cc.CleanUp.create(label)));
    return label;
};

cc.rectCreate = function (p, area)
{
    return  cc.rect(p.x - area[0], p.y - area[1], area[0] * 2, area[1] * 2);
}


function getRandom(maxSize)
{
    return Math.floor(Math.random() * maxSize) % maxSize;
}

Array.prototype.contains = function (value)
{
    for (var i = 0; i < this.length; i++) {
        if (this[i] == value) {
            return true;
        }
    }
    return false;
}

currentLevel = 1;
currentLevelScore = 0;


var ccb_resources = [

    {src: "Resources/bg_main.png"},
    {src: "Resources/star_packer.plist"},
    {src: "Resources/star_packer.plist"},

    {src: "Resources/particles/leaf_open.plist"},
    {src: "Resources/particles/quanquan.plist"},
    {src: "Resources/particles/spark.plist"},
    {src: "Resources/particles/fire.png"},
    {src: "Resources/particles/star1d.png"},
    {src: "Resources/particles/star2d.png"},
    {src: "Resources/particles/star3d.png"},
    {src: "Resources/particles/star4d.png"},
    {src: "Resources/particles/star5d.png"},

    {src: "Resources/fonts/bitmapFontTest.png"},
    {src: "Resources/fonts/character.png"},
    {src: "Resources/fonts/highscore.png"},
    {src: "Resources/fonts/s_number_member_small.fnt"},
    {src: "Resources/fonts/s_number_member_small.png"},
    {src: "Resources/fonts/s_number_score.fnt"},
    {src: "Resources/fonts/s_number_score.png"},
    {src: "Resources/fonts/highscore.png"},
    {src: "Resources/fonts/titleinfo.fnt"}


];

require("MainLayer.js");
require("StartLayer.js");

if (sys.platform == 'browser') {

    var Cocos2dXApplication = cc.Application.extend({
        config: document['ccConfig'],
        ctor: function ()
        {
            this._super();
            cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
            cc.initDebugSetting();
            cc.setup(this.config['tag']);
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        },
        applicationDidFinishLaunching: function ()
        {
            var director = cc.Director.getInstance();
            // director->enableRetinaDisplay(true);
            // director.setDisplayStats(this.config['showFPS']);
            // set FPS. the default value is 1.0/60 if you don't call this
            director.setAnimationInterval(1.0 / this.config['frameRate']);
            var glView = director.getOpenGLView();
            glView.setDesignResolutionSize(720, 1280, cc.RESOLUTION_POLICY.SHOW_ALL);
            cc.Loader.preload(ccb_resources, function ()
            {
                cc.BuilderReader.runScene("", "StartLayer");
            }, this);
            return true;
        }
    });
    var myApp = new Cocos2dXApplication();
}
else {
    cc.BuilderReader.runScene("", "StartLayer");
}