Blogs = new Mongo.Collection ('blogs');

if (Meteor.isClient) {
  
  Template.body.helpers({
      blogs: function() {
        return Blogs.find();
      }
  });

  Template.body.events({
      'submit .new-blog': function(event){
          var title = event.target.title.value;
          var content = event.target.content.value;
          if (title && content){
            Meteor.call("addBlog",title,content);
          }; 
          event.target.title.value =""
          event.target.content.value =""
          return false;
      }
  });

  Template.blog.helpers({
      isOwner:function(){
        return this.owner === Meteor.userId();
      }
  });

  Template.blog.events({
    'click .toggle-checked': function(){
        Meteor.call("updateBlog",this._id, !this.checked);
   },
    'click .delete': function(){
        Meteor.call("deleteBlog",this._id);
   }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Meteor.methods({
  addBlog: function(title,content){
    Blogs.insert({
            title: title, content: content,
            createdAt: new Date(), owner: Meteor.userId(),
            blogger: Meteor.user().username
          });  
  },
  updateBlog: function(id,checked){
    Blogs.update(id,{$set:{checked: checked}})
  },
  deleteBlog: function(id){
    Blogs.remove(id);
  }
});
