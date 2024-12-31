
            // This script hides/shows divs if menu bars are clicked.
            
            // It fetches the IDs of the divs so it can hide them
            const accountInfo = document.getElementById('acct-dtl-content');
            const security = document.getElementById('security-content');
            const privacy = document.getElementById('privacy-content');

            // it finds the buttons so we can make them bold when they're selected
            const securityButton = document.getElementById('security-btn');
            const privacyButton = document.getElementById('privacy-btn');
            const accountInfoButton = document.getElementById('acct-dtl-btn');

            // I don't have to type out the style stuff. It cleans everything up
            function makeBold(e){
                e.style.fontWeight = 'bold';
            }
            function makeNormal(e) {
                e.style.fontWeight = 'normal';
            }
            function showDiv(e) {
                e.style.display = 'block'
            }
            function hideDiv(e) {
                e.style.display = 'none';
            }
            // When the account button is clicked, it hides the other 
            // divs and shows the acct div. 
            function accountDetail() {
                showDiv(accountInfo);
                hideDiv(security);
                hideDiv(privacy);
                // It unbolds the other buttons and bolds the account button
                makeBold(accountInfoButton);
                makeNormal(privacyButton);
                makeNormal(securityButton);
            }

            // same for these functions just for their respoective elements
            function securityDetail() {
                hideDiv(accountInfo);
                showDiv(security);
                hideDiv(privacy);
                makeNormal(accountInfoButton);
                makeNormal(privacyButton);
                makeBold(securityButton);
            }
            function privacyDetail() {
                hideDiv(accountInfo);
                hideDiv(security);
                showDiv(privacy);
                makeNormal(accountInfoButton);
                makeBold(privacyButton);
                makeNormal(securityButton);
            }
            // This script promts an 'Are you sure?' textbox when clicking the button to delete your account
            function checkDelete(event) {
                    event.preventDefault()
                    if (confirm('Are you sure you want to delete your account?') == true) {
                        const hiddenInput = document.createElement('input'); //creates a hidden input so 'delete' is still in request.form (using submit() removes it for some reason)
                        hiddenInput.type = 'hidden';
                        hiddenInput.name = 'delete';
                        document.getElementById('delete-account').appendChild(hiddenInput);
                        document.getElementById('delete-account').submit()
                    }
            }

            // Submits the image when uploading a profile picture
            file = document.getElementById('file');
            file.addEventListener('change',() => {
                if(file.files.length > 0){
                    document.getElementById('upload_pfp').submit();
                }
            })