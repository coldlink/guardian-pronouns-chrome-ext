'use strict';

const pronouns = [
  ['your.email@guardian.co.uk','they/them'],
]

// store pronouns here
const pronounMap = new Map(pronouns);

// add a users pronoun to a given element
const addPronoun = (element) => {
  // get the email from the element attribute
  const email = element.getAttribute('data-hovercard-id');
  
  // if our datastore does not have that persons pronouns
  // then skip this person, and set the `data-pronoun` attribute to false
  if (!pronounMap.has(email)) {
    element.setAttribute('data-pronoun', 'false');
    return;
  }
  
  // pronoun must exist, so retrieve pronoun from the datastore
  const pronoun = pronounMap.get(email);

  // get the child of the user node element which contains the users name
  const child = element.firstElementChild;
  
  // check if it actually exists
  if (child) {
    // append the pronoun to the name
    child.innerHTML += ` | ${pronoun}`;
    // set the data-pronoun attribute to true
    element.setAttribute('data-pronoun', 'true');
  }
}

// on google chat (and any google chat iframe)
if (window.location.hostname === 'chat.google.com') {
  // Create a new MutationObserver object observer, we look at DOM mutations
  const observer = new MutationObserver((mutations) => {
    // loop through each observed mutation
    mutations.forEach(mutation => {
      // update pronouns on things like scroll, and open thread
      if (mutation.target.nodeType === 1 && (mutation.target.matches('.Bl2pUd') || mutation.target.matches('.SvOPqd') || mutation.target.matches('.jGyvbd'))) {
        const allUserSpanNodes = mutation.target.querySelectorAll('span[data-member-id]:not([data-pronoun])');
        allUserSpanNodes.forEach(element => {
          addPronoun(element);
        });
      }

      // on node element added
      mutation.addedNodes.forEach(addedNode => {
        // make sure it's an element so we can call properties on the Element type
        if (addedNode.nodeType === 1) {
          // changes to the main body when changing rooms
          if (addedNode.matches('.Bqp03e')) {
            const allUserSpanNodes = addedNode.querySelectorAll('span[data-member-id]:not([data-pronoun])');
            allUserSpanNodes.forEach(element => {
              addPronoun(element);
            });
          }

          // changes to single span on load/insert
          if (addedNode.matches('span[data-member-id]:not([data-pronoun])')) {
            addPronoun(addedNode);
          }
        }
      })
    })
  });

  // Observe a DOM node with the observer as callback
  observer.observe(document.body, { childList: true, subtree: true });
}