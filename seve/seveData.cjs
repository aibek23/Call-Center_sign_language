const ffmpeg = require('fluent-ffmpeg')
const { Blob, Buffer }=  require('buffer')
 const assert = require('assert');
 const fs = require('fs');
 const MongoGridFS = require('mongo-gridfs');
//  const mongodb = require('mongodb');
 
//  const uri = 'mongodb+srv://root:root@cluster0.ri2wq.mongodb.net/videochatDB1?retryWrites=true&w=majority';
//  const dbName = 'video';
 
//  mongodb.MongoClient.connect(uri, function(error, client) {
//    assert.ifError(error);
 
//    const db = client.db(dbName);
 
//    var bucket = new mongodb.GridFSBucket(db);
 
//    fs.createReadStream('./meistersinger.mp3').
//      pipe(bucket.openUploadStream('meistersinger.mp3')).
//      on('error', function(error) {
//        assert.ifError(error);
//      }).
//      on('finish', function() {
//        console.log('done!');
//        process.exit(0);
//      });
//  }); 




const saveData = async (data, username) => {
 
 const fileName = `${Date.now()}-${username}.webm`
  const tempFilePath = `${dirPath}/temp-${fileName}`
  const finalFilePath = `${dirPath}/${fileName}` 
try {
    const videoBlob = new Blob(data, {
      type: 'video/webm'
    })
    const videoBuffer = Buffer.from(await videoBlob.arrayBuffer())

    await writeFile(tempFilePath, videoBuffer)

    ffmpeg(tempFilePath)
      .outputOptions([
        '-c:v libvpx-vp9',
        '-c:a copy',
        '-crf 35',
        '-b:v 0',
        '-vf scale=1280:720'
      ])
      .on('end', async () => {
        await unlink(tempFilePath)
        console.log(`*** File ${fileName} created`)
      })
      .save(finalFilePath, dirPath)

      var bucket =  new MongoGridFS();
      fs.createReadStream(finalFilePath).
      pipe(bucket.openUploadStream(finalFilePath)).
      on('error', function(error) {
        assert.ifError(error);
      }).
      on('finish', function() {
        console.log('done!');
        process.exit(0);
      });
  } catch (e) {
    console.log('*** saveData', e)
  }
}
