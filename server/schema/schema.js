const graphql = require("graphql");
const _ = require("lodash");
const Book = require('../models/book');
const Author = require('../models/author');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

// dummy data
// var books = [
//   { name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "1" },
//   { name: "Esperence Sportif de Tunis", genre: "tunis",id: "2",authorId: "2" },
//   { name: "Taraji Riadhi Tounsi", genre: "BOMBOM", id: "3", authorId: "2" },
//   { name: "Wevioo Tunis", genre: "tunis", id: "3", authorId: "2" },
//   { name: "France wevioo", genre: "france", id: "3", authorId: "3" },
//   { name: "Taraji Riadhi Tounsi", genre: "BOMBOM", id: "3", authorId: "3" },
// ];

// var authors = [
//   { name: "Jamel", age: 27, id: "1" },
//   { name: "yassine", age: 29, id: "2" },
//   { name: "Hamza", age: 25, id: "3" }
// ];



// test it in Graphiql
// {
//   books{
//     name
//     genre
//   }
// }


// {
//   books{
//     name
//     genre
//     author{
//       name
//       age
//     }
//   }
// }

// {
//   authors{
//     name
//     age
//   }
// }

// {
//   authors{
//     name
//     age
//     books{
//       name
//     }
//   }
// }

// {
//   book(id: "5bb73aa63db4da43c89a0ff0"){    // id of the book in mongodb
//     name
//     genre
//     author{
//       name
//     }
//   }
// }

// {
//   book(id: "5bb73aa63db4da43c89a0ff0"){    // id of the book in Mongodb
//     name
//     genre
//     author{
//       name
//       books{
//         name
//       }
//     }
//   }
// }


// {
//   author(id: "5bb738faa48341179ca649b3"){  // id of author in mongodb
//     name
//     age
//     books{
//       name
//     }
//   }
// }


const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // console.log(parent);
        // return _.find(authors, { id: parent.authorId });
        return Author.findById(parent.authorId)
      }
    }
  })
  
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books:{ //every author have a list of books
      type: new GraphQLList(BookType),
      resolve(parent, args){
        // return _.filter(books, {authorId: parent.id})
        return Book.find({ authorId: parent.id});
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //code to get data from db / other source
        // console.log(typeof args.id);
        // return _.find(books, { id: args.id });
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return _.find(authors, { id: args.id });
        return Author.findById(args.id);
      }
    },
    books:{
      type: new GraphQLList(BookType),
      resolve(parent, args){
        // return books
        return Book.find({});
      }
    },
    authors:{
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        // return authors
        return Author.find({});
      }
    }
  }
});

// mutation to test in graphql? interface
// mutation{
//   addAuthor(name: "jame", age: 38){
//     name
//     age
//   }
// }
const Mutation = new GraphQLObjectType({
  name:'Mutation',
  fields: {
    addAuthor:{
      type:AuthorType,
      args:{
        name:{ type:new GraphQLNonNull(GraphQLString) },
        age: { type:new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args){
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args:{
        name:{type: new GraphQLNonNull(GraphQLString )},
        genre: {type:new GraphQLNonNull(GraphQLString) },
        authorId: {type:new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args){
        let book = new Book({
          name:args.name,
          genre: args.genre,
          authorId:args.authorId
        });
        return book.save();
      }
    }
  }
})


module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
