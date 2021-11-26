"use strict";

let upload = {

    // todo: change redirect reference
    drag_and_drop_00001:
    `
<link href="https://transloadit.edgly.net/releases/uppy/v0.30.3/uppy.min.css" property="stylesheet" rel="stylesheet">
<div id="drag-drop-area"></div>
<script src="https://transloadit.edgly.net/releases/uppy/v0.30.3/uppy.min.js"></script>
<script>
    const XHRUpload = Uppy.XHRUpload;
    var uppy = Uppy.Core(
        {
           autoProceed: true,
           restrictions: {
            maxFileSize: null,
            maxNumberOfFiles: 1,
            minNumberOfFiles: 1,
            allowedFileTypes: ['.xls', '.xlsx', '.csv']
          },
        }
        )
        .use(Uppy.Dashboard, {
            inline: true,
            target: '#drag-drop-area',
            proudlyDisplayPoweredByUppy: false
        })
        .use(XHRUpload, {
            endpoint: '|$endpoint|', 
            method: 'post',
        });

    uppy.on('complete', (result) => {
        console.log('Upload complete! We’ve uploaded these files:', result.successful)
    });
    
    uppy.on('upload-success', (file, body) => {
        window.location.replace(body.body.url$String);
    });
</script> 
`

}; module.exports.upload = upload;