// // const { model, Types } = require('mongoose')
// // const { createModel } = require( 'mongoose-gridfs')

// // const createModel = new createModel({
// //     video: { type: Types.Mixed, required: true,},
// //     fileId: { type: String, required: true, },
// //     username: { type: String, required: true },
// //     date: { type: Date, default: Date.now },
// //     owner: { type: Types.ObjectId, ref: 'User' }
// // })

// const {createReadStream} = require('fs');
// const {createModel} = require('mongoose-gridfs');

// // use default bucket
// const Attachment = createModel();

// // or create custom bucket with custom options
// // const Attachment = createModel({
// //     modelName: 'Attachment',
// //     connection: connection
// // });

// // write file to gridfs
// const readStream = createReadStream('sample.txt');
// const options = ({ filename: 'sample.txt', contentType: 'text/plain' });
// Attachment.write(options, readStream, (error, file) => {
//   //=> {_id: ..., filename: ..., ...}
//   {_id:'6283c5a678164523900ec3d3' }
// });

// // read larger file
// // const readStream = Attachment.read({ _id });

// // read smaller file
// Attachment.read({ _id }, (error, buffer) => { console.log(error); });

// // remove file and its content
// Attachment.unlink({ _id }, (error) => { console.log(error);});

// module.exports = model('Video', createModel)