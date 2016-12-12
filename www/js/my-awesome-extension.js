function MyAwesomeExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

MyAwesomeExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MyAwesomeExtension.prototype.constructor = MyAwesomeExtension;

MyAwesomeExtension.prototype.load = function () {
    //   alert('MyAwesomeExtension is loaded!');
    var viewer = this.viewer;

    var lockBtn = document.getElementById('MyAwesomeLockButton');
    lockBtn.addEventListener('click', function () {
        viewer.setNavigationLock(true);
    });

    var unlockBtn = document.getElementById('MyAwesomeUnlockButton');
    unlockBtn.addEventListener('click', function () {
        viewer.setNavigationLock(false);
    });

    //Binds the selection on viewer to the UI element
    this.onSelectionBinded = this.onSelectionEvent.bind(this);
    this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);

    //Binds the navigation tool to the UI element
    this.onNavigationModeBinded = this.onNavigationModeEvent.bind(this);
    this.viewer.addEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onNavigationModeBinded);

    // Binds the ToolBar on the viewer itself
    if (this.viewer.toolbar) {
        // Toolbar is already available, create the UI
        this.createUI();
    } else {
        // Toolbar hasn't been created yet, wait until we get notification of its creation
        this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
        this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }

    return true;
};

//Changes the selection number on the UI element
MyAwesomeExtension.prototype.onSelectionEvent = function (event) {
    //Gets the current Selection
    var currSelection = this.viewer.getSelection();
    var domElem = document.getElementById('MySelectionValue');
    domElem.innerText = currSelection.length;
};

//Changes the selected tool name on the UI element
MyAwesomeExtension.prototype.onNavigationModeEvent = function (event) {
    var domElem = document.getElementById('MyToolValue');
    //Both event.id and viewer.getActiveNavigationTool() do the same thing
    //domElem.innerText = event.id;
    domElem.innerText = this.viewer.getActiveNavigationTool();
};

//Removes the toolbar created event for cleanup
MyAwesomeExtension.prototype.onToolbarCreated = function () {
    this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
};

MyAwesomeExtension.prototype.createUI = function () {
    //alert('TODO: Create Toolbar!');
    var viewer = this.viewer;

    // Button 1
    var button1 = new Autodesk.Viewing.UI.Button('my-view-front-button');
    button1.onClick = function (e) {
        viewer.setViewCube('front');
    };
    button1.addClass('my-view-front-button');
    button1.setToolTip('Olhar de frente');

    // Button 2
    var button2 = new Autodesk.Viewing.UI.Button('my-view-back-button');
    button2.onClick = function (e) {
        viewer.setViewCube('back');
    };
    button2.addClass('my-view-back-button');
    button2.setToolTip('Olhar por tras');

    // Button 3
    var button3 = new Autodesk.Viewing.UI.Button('my-custom-button');
    button3.onClick = function (e) {
        viewer.setViewCube('top');
    };
    button3.addClass('my-custom-button');
    button3.setToolTip('Olhar de topo');

    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('my-custom-view-toolbar');
    this.subToolbar.addControl(button1);
    this.subToolbar.addControl(button2);

    this.subToolbar2 = new Autodesk.Viewing.UI.ControlGroup('my-custom-view-toolbar2')
    this.subToolbar2.addControl(button3);

    viewer.toolbar.addControl(this.subToolbar);
    viewer.toolbar.addControl(this.subToolbar2);
};

//Unloads everyhting
MyAwesomeExtension.prototype.unload = function () {
    // alert('MyAwesomeExtension is now unloaded!');

    var lockBtn = document.getElementById('MyAwesomeLockButton');
    lockBtn.removeEventListener('click', this.onLockBinded);

    var unlockBtn = document.getElementById('MyAwesomeUnlockButton');
    unlockBtn.removeEventListener('click', this.onUnlockBinded);

    this.onLockBinded = null;
    this.onUnlockBinded = null;

    //Unloads the selection event listener
    this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
    this.onSelectionBinded = null;

    //Unloads the navigation tool event listener
    this.viewer.removeEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onNavigationModeBinded);
    this.onNavigationModeBinded = null;

    //Unloads the custom toolbar
    this.viewer.toolbar.removeControl(this.subToolbar);

    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('MyAwesomeExtension', MyAwesomeExtension);