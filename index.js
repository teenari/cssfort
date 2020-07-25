$(document).ready(async () => {
    const user = await (await fetch('https://fortnitebtapi.herokuapp.com/api/user', {
        credentials: 'same-origin', // glitching testing currently
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })).json();
    if(user.authorization !== false) {
        $('.loginDiscord')[0].innerText = 'Continue';
        $('.loginDiscord').css('background', 'white').css('color', 'black').click(() => {
            window.location = 'https://teenari.github.io/fortnitebt/dashboard';
        });
        $('#username')
    }
})