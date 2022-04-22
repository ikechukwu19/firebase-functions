/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// auth trigger (new user)
exports.newUserSignUp = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    upvotedOn: [],
  });
});

// (user deleted)
exports.userDeleted = functions.auth.user().onDelete((user) => {
  console.log("user deleted", user.email, user.uid);
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});

// http callable function (adding tutorial request)

exports.addRequest = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "only authenticated users can add request"
    );
  }

  if (data.text.length > 30) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "request must be not more than 30 characters long"
    );
  }

  return admin.firestore().collection("request").add({
    text: data.text,
    upvotes: 0,
  });
});

// upvote callable function
exports.upvote = functions.https.onCall( async (data, context) => {
  // check auth state
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "only authenticated users can add request"
    );
  }
  // get colrefs for user and request doc
  const user = admin.firestore().collection("users").doc(context.auth.uid);
  const request = admin.firestore().collection("request").doc(data.id);

  const doc = await user.get();
  //check user hasn't already upvoted the request
  if (doc.data().upvotedOn.includes(data.id)) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "You can only upvote once"
    );
  }

  //update user array
  await user.update({
    upvotedOn: [...doc.data().upvotedOn, data.id],
  });

  return request.update({
    upvotes: admin.firestore.FieldValue.increment(1),
  });
});
