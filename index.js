$(document).ready(async () => {
    const user = await (await fetch('https://fortnitebtapi.herokuapp.com/api/user', {
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })).json();
    if(user.authorization !== false) {
        if(!user.inServer) {
            return window.location = 'https://discord.gg/xkURTCz';
        }
        $('.loginDiscord')[0].innerText = 'Continue';
        $('.loginDiscord').css('background', 'white').css('color', 'black').click(() => {
            window.location = 'https://teenari.github.io/fortnitebt/dashboard';
        });
        $('#username')[0].innerText = `Welcome ${user.username}#${user.discriminator}`;
    }

    $('.loginDiscord').fadeIn();
})