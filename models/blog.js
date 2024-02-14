const mongoose = require('mongoose');
const Comment = require('./comments');
const {Schema} = mongoose;


// imageSchema.virtual('thumbnail').get(function() {
//     return this.url.replace('/upload', '/upload/w_200');
// }); 

const blogSchema = new Schema ({
    title: String,
    image: String,
    content: String,
    Date: {
        type: Date,
        default: Date.now
    },
    formattedDate:{
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
})

// Middleware to automatically update the formattedDate field before saving
blogSchema.pre('save', function(next) {
    const date = new Date(this.Date);
    const formattedDate = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    this.formattedDate = formattedDate;
    next();
});
  
// Function to pad single digit numbers with a leading zero
function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
}

//Delete comments function 
blogSchema.post('findOneAndDelete', async function (doc){
  if (doc) {
      await Comment.deleteMany({
          _id:{
              $in: doc.comments
          }
      })
  }
})


module.exports = mongoose.model('Blog', blogSchema);