var viewer;

var options = {
    env: 'AutodeskProduction',
    getAccessToken: function (onGetAccessToken) {
        var accessToken = '';
        httpGetAsync((window.location.protocol + '//' + window.location.host + '/api/token'), (tokenb) => {
            if (tokenb)
            {
                var accessToken = tokenb;
                var expireTimeSeconds = 60 * 30;
                onGetAccessToken(accessToken, expireTimeSeconds);
            }
        });
    }
};
function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE2LTEyLTEyLTE3LTUwLTQxLXNna2lvazMweTgyODlyeDd6MHFhbmZ3YmM1NzUvQ2Fib3MuZHdmeA';
Autodesk.Viewing.Initializer(options, function onInitialized() {
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSucess, onDocumentLoadFailure);
});

function onDocumentLoadSucess(doc) {
    var viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), { 'type': 'geometry' }, true);
    if (viewables.length === 0) {
        console.error('Document contains no viewables.');
        return;
    }
    var initialViewable = viewables[0];
    var svfUrl = doc.getViewablePath(initialViewable);
    var modelOptions = { sharedPropertyDbPath: doc.getPropertyDbPath() };
    var viewerDiv = document.getElementById('MyViewerDiv');
    
    var configs = {
        extensions: ['MyAwesomeExtension']
    };
    
    viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv, configs);
    //viewer = new Autodesk.Viewing.Viewer3D(viewerDiv);
    viewer.start(svfUrl, modelOptions, onLoadModelSucess, onLoadModelError);
};

function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode: ' + viewerErrorCode);
};

function onLoadModelSucess(model) {
    console.log('onLoadModelSucess()!');
    console.log('Validate model loaded:' + (viewer.model === model));
    console.log(model);
};

function onLoadModelError(viewerErrorCode) {
    console.error('onloadModelError() - errorCode: ' + viewerErrorCode);
};