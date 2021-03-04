// Backbone Model
var Post = Backbone.Model.extend({
    defaults:{
        subject: '',
        body: '',
        by: '',
        like: 'Like'
    }
});

// Backbone Collection
var Posts = Backbone.Collection.extend({});

// instantiate a Collection
var posts = new Posts();

// Backbone View for one Post
var PostView = Backbone.View.extend({
    model: new Post(),
    tagName: 'tr',

    initialize: function(){
        this.template = _.template($('.posts-list-template').html());

    },
    events: {
        'click .edit-post': 'edit',
        'click .update-post': 'update',
        'click .cancel': 'cancel',
        'click .delete-post': 'delete',
        'click .like-post': 'like',

    },
    edit: function(){
        this.$('.edit-post').hide();
        this.$('.delete-post').hide();
        this.$('.update-post').show();
        this.$('.cancel').show();

        var subject = this.$('.subject').html();
        var body = this.$('.body').html();
        var by = this.$('.by').html();

        this.$('.subject').html('<input class="form-control subject-update" value="'+ subject +'">')
        this.$('.body').html('<input class="form-control body-update" value="'+ body +'">')
        this.$('.by').html('<input class="form-control by-update" value="'+ by +'">')


    },
    update: function(){
        this.model.set('subject', $('.subject-update').val());
        this.model.set('body', $('.body-update').val());
        this.model.set('by', $('.by-update').val());

    },
    cancel: function(){
        postsView.render();
    },
    delete: function(){
        this.model.destroy();
    },
    like: function(){
        if (this.$('.like-post').html() === 'Like'){
            this.model.set('like', "Unlike");
        }
        else{
            this.model.set('like', "Like");
        }
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

// Backbone View for all Posts
var PostsView = Backbone.View.extend({
    model: posts,
    el: $('.posts-list'),

    tagName: 'tr',
    initialize: function(){
        var self = this;
        this.model.on('add', this.render, this);
        this.model.on('change', function(){
            setTimeout(function(){
                self.render();
            },30);
        }, this);
        this.model.on('remove', this.render, this);
    },
    render: function(){
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function(post){
            self.$el.append((new PostView({model: post})).render().$el);
        });
        return this;
    }
});

var postsView = new PostsView();

$(document).ready(function(){
    $('.add-post').on('click', function(){
        var post = new Post({
            subject:$('.subject-input').val(),
            body:$('.body-input').val(),
            by:$('.by-input').val()
        });
        $('.subject-input').val('');
        $('.body-input').val('');
        $('.by-input').val('');
        // console.log(post.toJSON());
        posts.add(post);
    })
})