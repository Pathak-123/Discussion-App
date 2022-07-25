var submitQuestionNode = document.getElementById("submitBtn");
var questionTitleNode = document.getElementById("subject");
var questionDescriptionNode = document.getElementById("question");
var allQuestionsListNode = document.getElementById("dataList");
var createQuestionFormNode = document.getElementById("toggleDisplay");
var questionDetailContainerNode = document.getElementById("respondQue");
var resolveQuestionCOntainerNode = document.getElementById("resolveHolder");
var resolveQuestionNode = document.getElementById("resolveQuestion");
var responseContainerNode = document.getElementById("respondAns");
var commentContainerNode = document.getElementById("commentHolder");
var commentatorNameNode = document.getElementById("pickName");
var commentNode = document.getElementById("pickComment");
var submitCommentNode = document.getElementById("commentBtn");
var questionSearchNode = document.getElementById("questionSearch");
var upvote = document.getElementById("upvote");
var downvote = document.getElementById("downvote");

// listen to value change

questionSearchNode.addEventListener("change", function(event)
{
  // show filtered result
  filterResult(event.target.value);
})

// filter result

function filterResult(query)
{

  var allQuestions = getAllQuestions();
  
  if(query)
  {
    clearQuestionPanel();    

    var filteredQuestions = allQuestions.filter(function(question)
    {
      if(question.title.includes(query))
      {
        return true;
      }
    });

    if(filteredQuestions.length)
    {
      filteredQuestions.forEach(function(question)
      {
        addQuestionToPanel(question);
      })
    }
    else
    {
      printNoMatchFound();
    }
  }
  else
  {
    clearQuestionPanel();    

    allQuestions.forEach(function(question)
    {
      
        addQuestionToPanel(question);
      
    });
  }
}

// clear all questions

function clearQuestionPanel()
{
  allQuestionsListNode.innerHTML = ""
}


// display all exixting questions
function onLoad()
{
  // get all queations from storage
  var allQuestions = getAllQuestions();

  allQuestions.forEach(function(question)
  {
    addQuestionToPanel(question)
  })
}

onLoad();


// listen for the submit button to create question

submitQuestionNode.addEventListener("click", onQuestionSubmit);


function onQuestionSubmit()
{
  var question = {
    title: questionTitleNode.value,
    description: questionDescriptionNode.value,
    responses: [],
    upvotes:0,
    downvotes:0,
    createdAt: Date.now()
  }

  saveQuestion(question);
  addQuestionToPanel(question);
  clearQuestionForm();
}

// save question to the sotrage
function saveQuestion(question)
{
  // get all qiestions first and push the new qurstion
  // and then store again in storage
  
  var allQuestions = getAllQuestions();

  allQuestions.push(question);

  localStorage.setItem("questions", JSON.stringify(allQuestions));
}

// get all questions from storage

function getAllQuestions()
{
  var allQuestions = localStorage.getItem("questions");

  if(allQuestions)
  {
    allQuestions = JSON.parse(allQuestions)
  }
  else
  {
    allQuestions = []
  }

  return allQuestions;

}

// append question to the left panel
function addQuestionToPanel(question)
{
  var questionContainer = document.createElement("div");
  questionContainer.setAttribute("id", question.title);
  questionContainer.style.background = "Red";

  var newQuestionTitleNode = document.createElement("h4");
  newQuestionTitleNode.innerHTML = question.title;
  newQuestionTitleNode.style.paddingLeft = "10px";
  questionContainer.appendChild(newQuestionTitleNode);


  var newQuestionDescriptionNode = document.createElement("u");
  newQuestionDescriptionNode.innerHTML = question.description;
  newQuestionDescriptionNode.style.paddingLeft="10px";
  questionContainer.appendChild(newQuestionDescriptionNode);


  var upvoteTextNode = document.createElement("h4");
  upvoteTextNode.innerHTML = "upvote = "+ question.upvotes
  upvoteTextNode.style.paddingLeft = "10px";
  upvoteTextNode.style.backgroundColor ="white";
  questionContainer.appendChild(upvoteTextNode);

  var downvoteTextNode = document.createElement("h4");
  downvoteTextNode.innerHTML = "downvote = "+question.downvotes;
  downvoteTextNode.style.backgroundColor ="yellow";
  downvoteTextNode.style.paddingLeft="10px";
  questionContainer.appendChild(downvoteTextNode);

  var creationDateAndTimeNode = document.createElement("h3");
  creationDateAndTimeNode.innerHTML = new Date(question.createdAt).toLocaleString();
  creationDateAndTimeNode.style.paddingLeft="10px";
  questionContainer.appendChild(creationDateAndTimeNode);

  var createAtNode=document.createElement("h5");
createAtNode.innerHTML="created: "+updateAndConvertTime(createAtNode)(question.createdAt)+" ago";
  questionContainer.appendChild(createAtNode);

  var fav = document.createElement("button");
  fav.setAttribute("id", question.isfav);
  fav.style.background = "white";
  if(question.isfav)
  {
   fav.innerHTML = "add to fav"
  }
  else
  {
     fav.innerHTML = "remove fav"
  }
   
  questionContainer.appendChild(fav);
  fav.addEventListener("click", favQuestion(question));


 allQuestionsListNode.appendChild(questionContainer);


  questionContainer.addEventListener("click", onQuestionClick(question) );

}

// clear question form

function clearQuestionForm()
{
  questionTitleNode.value="";
  questionDescriptionNode.value = "";
}

// listen for click on question and display in right pane

function onQuestionClick(question)
{
  return function()
  {
    // clouser you can access question variable
    // hide question panle
    hideQuestionPanel();

    // clear last details
    clearQuestionDetails();
    clearResponsePanel();

    // show clicked Question
    showDetails();

    // create question details
    addQuestionToRight(question);



    //show all previous responses
    question.responses.forEach(function(response)
    {
      addResponseInPanel(response)
    })

    // listen for response submit

    submitCommentNode.onclick =  onResponeSubmit(question);
    //clearResponsePanel();
    upvote.onclick = upvoteQuestion(question);
    downvote.onclick = downvoteQuestion(question);

    resolveQuestionNode.onclick = resolveQuestion(question);
  }
}

// upvotes
function upvoteQuestion(question)
{
  return function()
  {
    question.upvotes++;
    updateQuestion(question);
    updateQuestionUI(question);
  }
  
}

//downVote
function downvoteQuestion(question)
{
  return function()
  {
    question.downvotes++;
    updateQuestion(question);
    updateQuestionUI(question);

  }

}

// update question UI
function updateQuestionUI(question)
{
  // get question container from DOM
  var questionContainerNode = document.getElementById(question.title);

  questionContainerNode.childNodes[2].innerHTML = "upvote = "+ question.upvotes;
  questionContainerNode.childNodes[3].innerHTML = "downvote = "+question.downvotes;

}


// listen for click on submit response button
function onResponeSubmit(question)
{
  return function()
  {
    

    var response = {
        name: commentatorNameNode.value,
        description: commentNode.value
    }

    saveResponse(question, response);

    addResponseInPanel(response)
    clearResponseForm();
  }
}

// display response in response section

function addResponseInPanel(response)
{
  var responseContainer = document.createElement("div");
  responseContainer.style.backgroundColor = "wheat";
  //responseContainer.style.paddingLeft = "5px";
  //sresponseContainer.style.item.paddingLeft="5px"

  var userNameNode = document.createElement("h4");
  userNameNode.innerHTML = response.name;
  userNameNode.style.padding = "10px";

  var userCommentNode = document.createElement("p");
  userCommentNode.innerHTML = response.description;
  userCommentNode.style.padding = "10px";

  responseContainer.appendChild(userNameNode);
  responseContainer.appendChild(userCommentNode);

  responseContainerNode.appendChild(responseContainer);
}

function clearResponseForm()
{
  commentatorNameNode.value = "";
  commentNode.value ="";
}

// hide question panel
function hideQuestionPanel()
{
  createQuestionFormNode.style.display = "none";
}


// display questionDetails
function showDetails()
{
  questionDetailContainerNode.style.display = "block";
  resolveQuestionCOntainerNode.style.display = "block";
  responseContainerNode.style.display = "block";
  commentContainerNode.style.display = "block";
}

// show question
function addQuestionToRight(question)
{
  var titleNode = document.createElement("h3");
  titleNode.innerHTML = question.title;

  var descriptionNode = document.createElement("p")
  descriptionNode.innerHTML = question.description;

  var createdDate = document.createElement("h4");
  createdDate.innerHTML = new Date(question.createdAt).toLocaleString();


  questionDetailContainerNode.appendChild(titleNode);
  questionDetailContainerNode.appendChild(descriptionNode);
  questionDetailContainerNode.appendChild(createdDate);

}

// update question
function updateQuestion(updatedQuestion)
{
  var allQuestions = getAllQuestions();

  var revisedQuestions = allQuestions.map(function(question)
  {
    if( updatedQuestion.title  === question.title)
    {
      return updatedQuestion
    }

    return question;
  })

  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}


// 
function saveResponse(updatedQuestion, response)
{
  var allQuestions = getAllQuestions();

  var revisedQuestions = allQuestions.map(function(question)
  {
    if( updatedQuestion.title  === question.title)
    {
      question.responses.push(response)
    }

    return question;
  })

  localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}


function clearQuestionDetails()
{
  questionDetailContainerNode.innerHTML = "" ;
}

function clearResponsePanel()
{
 responseContainerNode.innerHTML = "" ;
}


function printNoMatchFound()
{
  var title = document.createElement("h1");
  title.innerHTML = "No match found";

  allQuestionsListNode.appendChild(title) 
}
function resolveQuestion(question)
{
//   var allQuestions = getAllQuestions();
//   var len = allQuestions.length;
//   var ind;
//   allQuestions.forEach(function (arrayItem) {
//     if(arrayItem.title == question.title)
//     {
//       ind = allQuestions.indexOf(arrayItem);
//     }    
// });
//   allQuestions.splice(ind);
//   localStorage.setItem("questions", JSON.stringify(allQuestions));
//   console.log(allQuestions)
 
    return function()
    {
      var allQuestions = getAllQuestions();
      var len = allQuestions.length;
      var ind;
      allQuestions.forEach(function (arrayItem) {
        if(arrayItem.title == question.title)
        {
          var ind = allQuestions.indexOf(arrayItem);
          console.log(ind);
          allQuestions.splice(ind,1);
        }    
    });
      //allQuestions.splice(ind);
      localStorage.setItem("questions", JSON.stringify(allQuestions));
      console.log(allQuestions)
      clearQuestionPanel();
      onLoad();
    }
}

function updateAndConvertTime(element)
{
  return function(time)
  {
    setInterval(function()
    {
      element.innerHTML = "created: "+convertDateToCreatedAtTime(time)+" ago";
    })

    return convertDateToCreatedAtTime(time);
  }
}


function convertDateToCreatedAtTime(date)
{
    var currentTime = Date.now();
    var timeLapsed = currentTime - new Date(date).getTime();

    var secondsDiff = parseInt(timeLapsed / 1000 );
    var minutesDiff = parseInt(secondsDiff / 60 );
    var hourDiff = parseInt(minutesDiff / 60 );
    minutesDiff = parseInt(minutesDiff%60);
    secondsDiff = secondsDiff%60;

    return hourDiff +" hours "+ minutesDiff +" minutes " + secondsDiff +" Seconds";
}

function favQuestion(question)
{
  return function(event)
  {
    event.stopPropagation();
    question.isfav = !question.isfav;
    updateQuestion(question);
    if(question.isfav)
    {
      event.target.innerHTML = "add to fav";
    }
    else
    {
      event.target.innerHTML = "remove fav";
    }

  }
}