/**
 * Object to store user interaction details
 */
let userInteraction = {
  category: '',
  subcategory: '',
  content: '',
};

/**
 * Function to handle sending messages and updating the chat interface
 * @param {number} option - The selected option number
 * @param {string} label - The label of the selected option
 */
function sendMessage(option, label) {
  const chatMessages = document.getElementById('chat-messages');
  if (option === 1 || option === 2 || option === 3) {
    // Display sub-options based on the selected main category
    chatMessages.innerHTML += `<p>You: <button class="user-message">${label}</button></p>`;
    displaySubOptions(option, label);
  } else {
    const input = option ? label : document.getElementById('chat-input').value;
    chatMessages.innerHTML += `<p>You: ${input}</p>`;
    fetch('/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: option ? option.toString() : input.toString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        chatMessages.innerHTML += `<p>${data.response}</p>`;
        userInteraction.content = data.response;
        askForMoreHelp();
      })
      .catch((error) => {
        chatMessages.innerHTML += `<p>Something went wrong. Please try again.</p>`;
        askForMoreHelp();
      });
  }
  document.getElementById('chat-input').value = '';
  validateInput(); // Disable button again after sending
}

/**
 * Function to display sub-options based on the selected main category
 * @param {number} option - The selected main category number
 * @param {string} label - The label of the selected main category
 */
function displaySubOptions(option, label) {
  const chatMessages = document.getElementById('chat-messages');
  if (option === 1) {
    chatMessages.innerHTML += `
          <button class="chat-button" onclick="handleSubOption('General Entry Requirement')">General Entry Requirement</button>
          <button class="chat-button" onclick="handleSubOption('English Language and Academic Pathway')">English Language and Academic Pathway</button>
          <button class="chat-button" onclick="handleSubOption('Advanced Standing/Credit Prior Learning')">Advanced Standing/Credit Prior Learning</button>
      `;
    userInteraction.category = label;
  } else if (option === 2) {
    chatMessages.innerHTML += `
          <button class="chat-button" onclick="handleSubOption('Course Overview')">Course Overview</button>
          <button class="chat-button" onclick="handleSubOption('Careers and Outcomes')">Careers and Outcomes</button>
          <button class="chat-button" onclick="handleSubOption('Accreditation')">Accreditation</button>
      `;
    userInteraction.category = label;
  } else if (option === 3) {
    chatMessages.innerHTML += `
          <button class="chat-button" onclick="handleSubOption('How to Apply')">How to Apply</button>
          <button class="chat-button" onclick="handleSubOption('Application and Acceptance Dates')">Application and Acceptance Dates</button>
          <button class="chat-button" onclick="handleSubOption('Advanced Standing/Credit Prior Learning')">Advanced Standing/Credit Prior Learning</button>
      `;
    userInteraction.category = label;
  }
}

/**
 * Function to handle sub-option selection and fetch content
 * @param {string} option - The selected sub-option
 */
function handleSubOption(option) {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML += `<p>You: <button class="user-message">${option}</button></p>`;
  userInteraction.subcategory = option;

  let fileName = '';
  if (option === 'General Entry Requirement') {
    fileName = 'general_entry_requirements.txt';
  } else if (option === 'English Language and Academic Pathway') {
    fileName = 'english_language_and_academic_pathway.txt';
  } else if (option === 'Advanced Standing/Credit Prior Learning') {
    fileName = 'advanced_standing_credit_prior_learning.txt';
  } else if (option === 'How to Apply') {
    fileName = 'how_to_apply.txt';
  } else if (option === 'Application and Acceptance Dates') {
    fileName = 'application_and_acceptance_dates.txt';
  }

  fetch('/get-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file: fileName }),
  })
    .then((response) => response.json())
    .then((data) => {
      chatMessages.innerHTML += `<p>${data.content}</p>`;
      userInteraction.content = data.content;
      askForMoreHelp();
    })
    .catch((error) => {
      chatMessages.innerHTML += `<p>Something went wrong. Please try again.</p>`;
      askForMoreHelp();
    });
}

/**
 * Function to ask the user if they need more help
 */
function askForMoreHelp() {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML += `
      <p class="bold-text">Do you need more help?</p>
      <div class="help-buttons">
          <button class="help-button" onclick="handleHelpResponse('no')">No</button>
          <button class="help-button" onclick="handleHelpResponse('yes')">Yes</button>
      </div>
  `;
}

/**
 * Function to handle user's response to more help
 * @param {string} response - The user's response
 */
function handleHelpResponse(response) {
  const chatMessages = document.getElementById('chat-messages');
  if (response === 'no') {
    chatMessages.innerHTML += `
          <p class="bold-text">I can send an email to you which contains our interactions</p>
          <div class="help-buttons">
              <button class="help-button" onclick="offerEmail('yes')">Yes, Email the interaction to me</button>
              <button class="help-button" onclick="offerEmail('no')">No, it is all good</button>
          </div>
      `;
  } else {
    chatMessages.innerHTML += `<p>How else can I assist you?</p>`;
  }
}

/**
 * Function to offer email interaction to the user
 * @param {string} response - The user's response to the email offer
 */
function offerEmail(response) {
  const chatMessages = document.getElementById('chat-messages');
  if (response === 'yes') {
    chatMessages.innerHTML += `
          <input type="email" id="email-input" placeholder="Enter your email address" />
          <button class="help-button" onclick="sendEmail()">Send Email</button>
      `;
  } else {
    chatMessages.innerHTML += `<p>Thank you for using the University Chatbot</p>`;
  }
}

/**
 * Function to send the email with the interaction details
 */
function sendEmail() {
  const email = document.getElementById('email-input').value;
  const { category, subcategory, content } = userInteraction;
  if (email && category && subcategory && content) {
    const subject = category;
    const body = `Category: ${category}\nSubcategory: ${subcategory}\n\n${content}`;

    fetch('/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, subject: subject, body: body }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          document.getElementById(
            'chat-messages'
          ).innerHTML += `<p>The interaction email has been sent to you</p>`;
        } else {
          alert('Failed to send email.');
        }
      })
      .catch((error) => {
        alert('Error sending email.');
        console.error('Error:', error);
      });
  } else {
    alert('Please provide a valid email address.');
  }
}

/**
 * Function to check if the Enter key is pressed
 * @param {object} event - The keydown event
 */
function checkEnter(event) {
  if (
    event.key === 'Enter' &&
    !document.getElementById('send-button').disabled
  ) {
    sendMessage();
  }
}

/**
 * Function to validate the input field
 */
function validateInput() {
  const input = document.getElementById('chat-input').value;
  document.getElementById('send-button').disabled = input.length < 3;
}
