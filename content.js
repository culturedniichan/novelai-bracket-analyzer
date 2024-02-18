function findPromptDiv() {
    var divs = document.querySelectorAll('div');
    for (var div of divs) {
        // Using includes to allow for extra text or whitespace
        if (div.textContent.includes("Prompt") && div.childElementCount === 0) {
            return div;
        }
    }
    return null; // Return null if no matching div is found
}

function validateText(text) {
    let stack = [];

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (char === '[' || char === '{') {
            // Push the corresponding closing bracket onto the stack
            stack.push(char === '[' ? ']' : '}');
        } else if (char === ']' || char === '}') {
            // If the stack is empty or the top of the stack doesn't match, return false
            if (stack.length === 0 || stack.pop() !== char) {
                return false;
            }
        }
        // Other characters are ignored
    }

    // If the stack is empty, all brackets were properly closed
    return stack.length === 0;
}

function findButton() {
    // Selects the first <button> element found in the document
    return document.querySelector('button');
}


function init() {
    console.log('Inside Novel AI extension init function');

    var isProcessing = false; // Semaphore flag
    var debounceTimer;
    function modifyDOM() {

        if (isProcessing) {
            // Exit if another invocation is in progress
            return;
        }

        isProcessing = true; // Set the fla

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            console.log("Inside modify DOM");
            var promptDiv = findPromptDiv();
            if (promptDiv) {
                console.log("Found prompt div:", promptDiv);

                var textAreas = document.querySelectorAll('textarea');
                console.log('Text areas:', textAreas.length);

                if (textAreas.length > 0) {
                    textAreas.forEach(textArea => {
                        textArea.addEventListener('input', function () {
                            if (validateText(this.value)) {
                                promptDiv.style.color = ''; // Reset to default color
                            } else {
                                promptDiv.style.color = 'red'; // Change color to red
                            }
                        });
                    });

                    // If textareas are found, disconnect the observer
                    observer.disconnect();
                }
            }

            isProcessing = false; // Reset the flag
        }, 1000); // Adjust the debounce time as needed
    }

    var observer = new MutationObserver(function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                modifyDOM();
                // Optionally, you can add additional checks here before calling modifyDOM()
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}



// Call init on window load
init();