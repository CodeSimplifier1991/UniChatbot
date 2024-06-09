// Function to handle sending messages
function sendMessage(option, label) {
  const chatMessages = document.getElementById('chat-messages');
  if (option === 1) {
    // Display additional buttons instead of reading content from a file for Entry Requirements
    chatMessages.innerHTML += `<p>You: <button class="user-message">${label}</button></p>`;
    chatMessages.innerHTML += `
                    <button class="chat-button" onclick="handleSubOption('General Entry Requirement')">General Entry Requirement</button>
                    <button class="chat-button" onclick="handleSubOption('English Language and Academic Pathway')">English Language and Academic Pathway</button>
                    <button class="chat-button" onclick="handleSubOption('Advanced Standing/Credit Prior Learning')">Advanced Standing/Credit Prior Learning</button>
                `;
  } else if (option === 2) {
    // Display additional buttons instead of reading content from a file for Course Information
    chatMessages.innerHTML += `<p>You: <button class="user-message">${label}</button></p>`;
    chatMessages.innerHTML += `
                    <button class="chat-button" onclick="handleSubOption('Course Overview')">Course Overview</button>
                    <button class="chat-button" onclick="handleSubOption('Careers and Outcomes')">Careers and Outcomes</button>
                    <button class="chat-button" onclick="handleSubOption('Accreditation')">Accreditation</button>
                `;
  } else if (option === 3) {
    // Display additional buttons instead of reading content from a file for Applying for a Course
    chatMessages.innerHTML += `<p>You: <button class="user-message">${label}</button></p>`;
    chatMessages.innerHTML += `
                    <button class="chat-button" onclick="handleSubOption('How to Apply')">How to Apply</button>
                    <button class="chat-button" onclick="handleSubOption('Application and Acceptance Dates')">Application and Acceptance Dates</button>
                    <button class="chat-button" onclick="handleSubOption('Advanced Standing/Credit Prior Learning')">Advanced Standing/Credit Prior Learning</button>
                `;
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

// Function to handle sub-option clicks
function handleSubOption(option) {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML += `<p>You: <button class="user-message">${option}</button></p>`;

  // Check if the sub-option is for showing courses
  if (
    option === 'Course Overview' ||
    option === 'Careers and Outcomes' ||
    option === 'Accreditation'
  ) {
    // Display course options
    chatMessages.innerHTML += `
                    <button class="chat-button" onclick="handleCourseSelection('Bachelor of Architectural Design')">Bachelor of Architectural Design</button>
                    <button class="chat-button" onclick="handleCourseSelection('Bachelor of Data Science')">Bachelor of Data Science</button>
                    <button class="chat-button" onclick="handleCourseSelection('Bachelor of Health Science')">Bachelor of Health Science</button>
                `;
  } else {
    // Fetch content for the other sub-options
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
        askForMoreHelp();
      })
      .catch((error) => {
        chatMessages.innerHTML += `<p>Something went wrong. Please try again.</p>`;
        askForMoreHelp();
      });
  }
}

// Function to handle course selection clicks
function handleCourseSelection(course) {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML += `<p>You: <button class="user-message">${course}</button></p>`;
  // Add your logic here to handle the selected course
  // Example:
  // if (course === 'Bachelor of Architectural Design') { ... }
}

// Function to check if Enter key is pressed
function checkEnter(event) {
  if (
    event.key === 'Enter' &&
    !document.getElementById('send-button').disabled
  ) {
    sendMessage();
  }
}

// Function to validate input field
function validateInput() {
  const input = document.getElementById('chat-input').value;
  document.getElementById('send-button').disabled = input.length < 3;
}

// Function to ask the user if they need more help
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

// Function to handle help response
function handleHelpResponse(response) {
  const chatMessages = document.getElementById('chat-messages');
  if (response === 'no') {
    chatMessages.innerHTML += `<p>Thank you for using the University Chatbot</p>`;
  } else {
    chatMessages.innerHTML += `<p>How else can I assist you?</p>`;
  }
}
