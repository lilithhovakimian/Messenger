function logIn() {
    return false;
}

let inputs = document.querySelectorAll('input#username, input#password');
let input = Array.from(inputs);
let messageHistory = {};
let currentFriendId;
let submit = document.querySelector('#submit');

if (document.querySelector("#loginPage")) {
    submit.addEventListener('click', function () {

        let notEmpty = input.some(val => {
            return (val.value === "") || !(val.value);
        });
        if (!notEmpty) {
            location.href = "messenger.html";
        }
    });
}

input.forEach(val => {
    val.addEventListener('keydown', e => {
        if (e.code == "Enter") {
            submit.click();
        }
    });
})

function friendsList() {
    fetch('friends.json').then(response => {
        return response.json();
    }).then(obj => {
        let friendValues = Object.values(obj);
        friendValues.forEach(val => {
            let node = document.createElement('li');
            node.appendChild(document.createTextNode(val.name));
            node.setAttribute('data-id', val.id);
            document.querySelector('ul').appendChild(node);
        });

        let friendNames = document.querySelectorAll('.friends-list ul li');
        let friendName = Array.from(friendNames);
        let messageFriend = document.querySelector('#messageFriend');
        let autoReply = document.querySelector("#autoReply");
        let send = document.querySelector("#send");
        let message = document.querySelector("#message");

        friendName.forEach(val => {
            val.addEventListener('click', e => {
                send.style.display = "block";
                message.style.display = "block";
                messageFriend.innerHTML = (e.target.innerHTML);
                message.value = null;
                while (autoReply.firstChild) {
                    autoReply.firstChild.remove();
                }
                currentFriendId = val.dataset.id;

                messageHistory[currentFriendId].forEach(val => {
                    let chatHistory = document.createElement('div');
                    let chatHistoryText = chatHistory.appendChild(document.createElement('p'));
                    chatHistoryText.appendChild(document.createTextNode(val));
                    autoReply.appendChild(chatHistory);
                });
            });
            messageHistory[val.dataset.id] = [];
        });

        send.addEventListener("click", sending);

        function sending() {
            let messageText = document.querySelector("#message").value;

            function appendMessage() {
                if (messageText && messageText !== "" && messageText.trim().length !== 0) {
                    let userMessage = document.createElement('div');
                    let userMessageText = userMessage.appendChild(document.createElement('p'));
                    userMessageText.appendChild(document.createTextNode(messageText));
                    autoReply.appendChild(userMessage);

                    if (userMessage) {
                        messageHistory[currentFriendId].push(messageText);
                    }
                }
            }
            appendMessage();
            setTimeout(appendMessage, 300);

            message.value = null;

            function scrolling() {
                document.querySelector("#autoReply").scrollTop = document.querySelector("#autoReply").scrollHeight;
            }
            setTimeout(scrolling, 300);
        }

        message.addEventListener('keydown', e => {
            if (e.code == "Enter") {
                send.click();
            }
        });
    });
}