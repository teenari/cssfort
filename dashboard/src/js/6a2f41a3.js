/**
 * Copyright 2020 Teenari
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

console.image('https://teenari.github.io/fortnitebt/src/images/74d1fa16.png');

const system = {
    "account": null,
    "party": null,
    "source": null,
    "friends": null,
    "messages": {
        "party": [],
        "friends": {},
        "handler": null
    },
    "settings": {
        "colorScheme": {
            "black": {
                "back": './src/images/schemes/black/back.png',
                "faceplate": './src/images/schemes/black/faceplate.png'
            },
            "partyroyale": {
                "back": './src/images/schemes/partyroyale/back.png',
                "faceplate": './src/images/schemes/partyroyale/faceplate.png'
            },
            "blue": {
                "back": './src/images/schemes/black/back.png',
                "faceplate": './src/images/schemes/black/faceplate.png'
            },
            "faceplate": './src/images/schemes/a77ecea5.png'
        },
        "currentScheme": 'partyroyale'
    },
    "items": {
        "outfit": null,
        "backpack": null,
        "pickaxe": null,
        // "banner": null,
        "conversions": {},
        "default": {},
        "variants": {},
        "cosmetics": {},
        "sort": {}
    }
}

let LoadingText = '';

function changeColorScheme(scheme) {
    Cookies.set('colorScheme', scheme);
    system.settings.currentScheme = scheme;
    if(system.settings.currentScheme === 'black') {
        $('html').css('background', 'black');
        $('html').removeClass('backgroundImage gradient blueGradient');
    }
    if(system.settings.currentScheme === 'partyroyale') {
        $('html').css('background', '');
        $('html').removeClass('backgroundImage gradient blueGradient');
        $('html').addClass('backgroundImage gradient');
    }
    if(system.settings.currentScheme === 'blue') {
        $('html').css('background', '');
        $('html').removeClass('backgroundImage gradient blueGradient');
        $('html').addClass('blueGradient gradient');
    }
    for (const item of $('img[src*="images/schemes"]')) {
        if(item.src.includes('faceplate.png')) item.src = system.settings.colorScheme[system.settings.currentScheme].faceplate;
        if(item.src.includes('back.png')) item.src = system.settings.colorScheme[system.settings.currentScheme].back;
    }
}

async function hideMenu(menu) {
    menu.fadeOut(250);
    await new Promise((resolve) => setTimeout(resolve, 250));
    menu.remove();
}

function createMenu(purpose) {
    if(document.getElementById(`MENU~${purpose}`)) document.getElementById(`MENU~${purpose}`).remove();
    const menu = document.createElement('div');
    menu.classList.add('menu');
    menu.id = `MENU~${purpose}`;
    menu.hidden = true;
    document.getElementById('menus').appendChild(menu);
    return menu;
}

function addCloseButton(menu, id) {
    const div = document.createElement('div');
    div.setAttribute("style", "font-size: 18px;background-color: black;border-radius: 4px;color: white;padding: 11px;cursor: pointer;text-align: center;margin: 6px;top: 1vh;position: relative;");
    div.id = id;
    div.innerHTML = 'Close Menu';
    [...document.getElementById(menu[0].id).children].find(e => e.className === 'cosmetic').appendChild(div);
    $(`[id="${id}"]`).click(async () => await hideMenu(menu));
    $(`[id="${id}"]`).unbind('hover').hover(
        () => $(`[id="${id}"]`).stop().animate({backgroundColor:'white', color: 'black'}, 100),
        () => $(`[id="${id}"]`).stop().animate({backgroundColor:'black', color: 'white'}, 100)
    );
    return $(`[id="${id}"]`);
}

async function showMenu(cosmeticType) {
    createMenu('cosmeticMenu');
    const menu = $('[id="MENU~cosmeticMenu"]');
    const id = system.items[cosmeticType.toLowerCase()].id;
    $(document).unbind('click');
    menu[0].innerHTML = `<div class="cosmetic">${cosmeticType}<br><div style="font-size: 20px; margin: 10px;">Select item by icon<div id="selectItem" class="clickHereButton">Click Here</div></div><div style="font-size: 20px; margin: 0px;">${id}</div><textarea placeholder="Item ID Here" id="cosmeticID"></textarea><div class="clickHereButton" id="SaveID" style="padding: 1px;font-size: 20px;">Save</div><div style="font-size: 20px; margin: 10px;">Select Variant by icon</div><div id="selectVariant" ${!Array.isArray(system.items[cosmeticType.toLowerCase()].variants) ? 'disabled' : ''} class="clickHereButton" style="font-size: 22px;margin: -2px;">${Array.isArray(system.items[cosmeticType.toLowerCase()].variants) ? 'Click Here' : 'Item does not have variant option'}</div></div>`;
    menu.fadeIn(250);
    await new Promise((resolve) => setTimeout(resolve, 250));
    $('#selectVariant').click(async () => {
        if(!system.items[cosmeticType.toLowerCase()].variants) return;
        let selectedVariants = [];
        await new Promise((resolve) => setTimeout(resolve, 1));
        menu.html(`<div class="cosmetic">${system.settings.currentScheme === 'partyroyale' ? '<div class="textBackground gradient">' : ''}PICK YOUR VARIANT${system.settings.currentScheme === 'partyroyale' ? '</div>' : '<br>'}<div class="clickHereButton" style="padding: 1px;font-size: 25px;cursor: auto;height: auto;position: relative;top: 10px;"><textarea placeholder="Search Here" style="margin: 0px;width: 300px;height: 13px;resize: none;font-size: 20px;outline: none;border: none;overflow: hidden;font-family: t;position: relative;" id="search"></textarea></div><br><h1 style="border: 1px solid black;margin: 0px;"></h1><div id="cosmetics" style="overflow-y: scroll;width: 340px;height: 300px;"></div><div class="clickHereButton" id="SaveVariant" style="padding: 1px;font-size: 20px;">SAVE</div></div>`);
        addCloseButton(menu, 'MENU~cosmeticMenu~close');
        $('#search').keyup(() => {
            const searchQuery = $('#search').val();
            for (const element of [...$('#cosmetics').children()].filter(e => !e.children[3].innerText.startsWith(searchQuery))) {
                element.hidden = true;
            }
            for (const element of [...$('#cosmetics').children()].filter(e => e.children[3].innerText.startsWith(searchQuery))) {
                element.hidden = false;
            }
        });
        for (const item of system.items[cosmeticType.toLowerCase()].variants) {
            for (const variant of item.options) {
                const div = document.createElement("div");
                div.id = `VARIANT/${variant.tag}#${variant.name}`;
                for (const src of [{
                    src: system.settings.colorScheme[system.settings.currentScheme].back
                }, {
                    src: variant.image,
                    position: 'relative',
                    right: '100px'
                }, {
                    src: system.settings.colorScheme[system.settings.currentScheme].faceplate,
                    position: 'relative',
                    right: '200px'
                }]) {
                    const IMAGE = document.createElement("IMG");
                    if(src.src) IMAGE.width = 100;
                    if(src.src) IMAGE.height = 100;
                    IMAGE.draggable = false;
                    IMAGE.style.cursor = 'pointer';
                    if(src.src) IMAGE.src = src.src;
                    if(src.position) IMAGE.style.position = src.position;
                    if(src.right) IMAGE.style.right = src.right;
                    const element = $('#cosmetics')[0].appendChild(div);
                    $(`[id="VARIANT/${variant.tag}#${variant.name}"]`)[0].appendChild(IMAGE);
                    if(src.src.includes('faceplate.png')) {
                        IMAGE.outerHTML += `<div style="left: 120px;bottom: 80px;position: relative;">${variant.name}</div>`;
                        element.onclick = async () => {
                            if(selectedVariants.find((e) => {
                                return e.image === variant.image;
                            })) {
                                selectedVariants = selectedVariants.filter((e) => {
                                    return e.image !== variant.image;
                                });
                                $(`[id="VARIANT/${variant.tag}#${variant.name}"]`).children()[2].src = system.settings.colorScheme[system.settings.currentScheme].faceplate;
                            }
                            else {
                                selectedVariants.push({channel: item.channel, tag: variant.tag, name: variant.name, image: variant.image});
                                $(`[id="VARIANT/${variant.tag}#${variant.name}"]`).children()[2].src = system.settings.colorScheme.faceplate;
                            }
                        }
                    }
                }
            }
        }
        if(system.items.variants[cosmeticType]) for (const variant of system.items.variants[cosmeticType]) {
            $(`[id="VARIANT/${variant.tag}#${variant.name}"]`).children()[2].src = system.settings.colorScheme.faceplate;
            selectedVariants.push(variant);
        }
        $('#SaveVariant').click(async () => {
            if(selectedVariants.length === 0) return;
            if(!system.items.variants[cosmeticType]) system.items.variants[cosmeticType] = [];
            system.items.variants[cosmeticType] = selectedVariants;
            const img = $(`#${id}`)[0].children[0];
            if($(`#${id}`)[0].children[2].outerHTML.includes('opacity: 0.7')) $(`#${id}`)[0].children[2].remove();
            $(`#${id}`)[0].children[1].outerHTML += `<img width="${img.width}" height="${img.height}" draggable="false" src="${selectedVariants[selectedVariants.length - 1].image}" style="cursor: pointer;position: absolute;opacity: 0.7;top: ${img.style.top};left: ${img.style.left};">`;
            const variants = [];
            for (const variant of selectedVariants) {
                variants.push({
                    "item": system.items[cosmeticType.toLowerCase()].type.backendValue,
                    "channel": variant.channel,
                    "variant": variant.tag
                })
            }
            addVariant(variants, cosmeticType.toLowerCase());
            await hideMenu(menu);
        });
    });
    $('#selectItem').click(async () => {
        let selectedItem = null;
        await new Promise((resolve) => setTimeout(resolve, 1));
        menu.html(`<div class="cosmetic">${system.settings.currentScheme === 'partyroyale' ? '<div class="textBackground gradient">' : ''}PICK YOUR ${cosmeticType}${system.settings.currentScheme === 'partyroyale' ? '</div>' : '<br>'}<div class="clickHereButton" style="padding: 1px;font-size: 25px;cursor: auto;height: auto;position: relative;top: 10px;"><textarea placeholder="Search Here" style="margin: 0px;width: 300px;height: 13px;resize: none;font-size: 20px;outline: none;border: none;overflow: hidden;font-family: t;position: relative;" id="search"></textarea></div><br><h1 style="border: 1px solid black;margin: 0px;"></h1><div id="cosmetics" style="overflow-y: scroll;width: 340px;height: 300px;"></div><div class="clickHereButton" id="SaveAvatar" style="padding: 1px;font-size: 21px;">SAVE</div></div>`);
        $('#search').keyup(() => {
            const searchQuery = $('#search').val();
            for (const element of [...$('#cosmetics').children()].filter(e => !e.children[3].innerText.startsWith(searchQuery))) {
                element.hidden = true;
            }
            for (const element of [...$('#cosmetics').children()].filter(e => e.children[3].innerText.startsWith(searchQuery))) {
                element.hidden = false;
            }
        });
        for (const item of system.items.cosmetics[cosmeticType.toLowerCase()]) {
            const div = document.createElement("div");
            div.id = `ITEM/${item.id}`;
            for (const src of [{
                src: system.settings.colorScheme[system.settings.currentScheme].back
            }, {
                src: item.images.icon,
                position: 'relative',
                right: '100px'
            }, {
                src: system.settings.colorScheme[system.settings.currentScheme].faceplate,
                position: 'relative',
                right: '200px'
            }]) {
                const IMAGE = document.createElement("IMG");
                if(src.src) IMAGE.width = 100;
                if(src.src) IMAGE.height = 100;
                IMAGE.draggable = false;
                IMAGE.style.cursor = 'pointer';
                if(src.src) IMAGE.src = src.src;
                if(src.position) IMAGE.style.position = src.position;
                if(src.right) IMAGE.style.right = src.right;
                const element = $('#cosmetics')[0].appendChild(div);
                ($(`[id="ITEM/${item.id}"]`)[0].appendChild(IMAGE)).onclick = async (e) => {
                    if(selectedItem === item) return;
                    if(selectedItem && selectedItem !== item) {
                        $(`[src="${system.settings.colorScheme.faceplate}"]`)[0].src = system.settings.colorScheme[system.settings.currentScheme].faceplate;
                    }
                    e.srcElement.src = system.settings.colorScheme.faceplate;
                    selectedItem = item;
                }
                if(src.src.includes('faceplate.png')) {
                    IMAGE.outerHTML += `<div style="left: 120px;bottom: 80px;position: relative;">${item.name}</div>`;
                    element.onclick = async () => {
                        if(selectedItem === item) return;
                        if(selectedItem && selectedItem !== item) {
                            $(`[src="${system.settings.colorScheme.faceplate}"]`)[0].src = system.settings.colorScheme[system.settings.currentScheme].faceplate;
                        }
                        $(`[id="ITEM/${item.id}"]`).children()[2].src = system.settings.colorScheme.faceplate;
                        selectedItem = item;
                    }
                }
            }
        }
        $('#SaveAvatar').click(async () => {
           if(!selectedItem) return;
            system.items[cosmeticType.toLowerCase()] = selectedItem;
            const img = $(`#${id}`)[0].children[0];
            $(`#${id}`)[0].id = selectedItem.id;
            $(`#${selectedItem.id}`)[0].innerHTML = '';
            for (const image of createImage(selectedItem, img.style.top.split('px')[0], img.style.left.split('px')[0], 'absolute', img.width, img.height)) {
                $(`#${selectedItem.id}`).append(image);
                image.onclick = async () => {
                    await showMenu(selectedItem.type.value.toUpperCase());
                }
            }
            changeItem(selectedItem.id, cosmeticType.toLowerCase());
            system.items.variants[cosmeticType] = [];
            await hideMenu(menu);
        });
        addCloseButton(menu, 'MENU~cosmeticMenu~close');
    });
    $('#SaveID').click(async () => {
        if($('[id="cosmeticID"]').val().trim() === "" || !system.items.cosmetics.find(e => e.id === $('[id="cosmeticID"]').val())) return;
        const item = system.items.cosmetics.find(e => e.id === $('[id="cosmeticID"]').val());
        system.items[cosmeticType.toLowerCase()] = item;
        const img = $(`#${id}`)[0].children[0];
        $(`#${id}`)[0].id = $('[id="cosmeticID"]').val();
        $(`#${$('[id="cosmeticID"]').val()}`)[0].innerHTML = '';
        for (const image of createImage(item, img.style.top.split('px')[0], img.style.left.split('px')[0], 'absolute', img.width, img.height)) {
            $(`#${$('[id="cosmeticID"]').val()}`).append(image);
            image.onclick = async () => {
                await showMenu(item.type.value.toUpperCase());
            }
        }
        await hideMenu(menu);
    });
    menu.draggable({
        "containment": "window"
    });
    addCloseButton(menu, 'MENU~cosmeticMenu~close');
    await new Promise((resolve) => setTimeout(resolve, 300));
    $(document).click(async (event) => { 
        if(!$(event.target).closest('#menu').length && $('#menu').is(":visible")) {
            await hideMenu(menu);
            $(document).unbind('click');
        }        
    });
}

function setLoadingText(text, doNot) {
    LoadingText = text;
    let dots = 0;
    $('#status').html(text);
    if(!doNot) {
        const inv = setInterval(() => {
            if(LoadingText !== text) clearInterval(inv);
            dots += 1;
            if(dots === 4) dots = 0;
            $('#status').html(text + '.'.repeat(dots));
        }, 500);
    }
}

function stopText() {
    LoadingText = ' '.repeat(1000);
}

function createImage(item, top, left, position, width=100, height=100, right=null, id=null, noExtra=false) {
    const IMAGES = [];

    for (const src of [system.settings.colorScheme[system.settings.currentScheme].back, item.images.icon, system.settings.colorScheme[system.settings.currentScheme].faceplate]) {
        const IMAGE = document.createElement("IMG");
        IMAGE.width = width;
        IMAGE.height = height;
        IMAGE.draggable = false;
        IMAGE.style.cursor = 'pointer';
        IMAGE.src = src;
        if(!noExtra) {
            if(position) IMAGE.style.position = position;
            if(top) IMAGE.style.top = `${top}px`;
            if(left) IMAGE.style.left = `${left}px`;
            if(right) IMAGE.style.left = `${right}px`;
        }
        if(id) IMAGE.id = item.id;
        IMAGES.push(IMAGE);
    }

    return IMAGES;
}

async function createImageInElement(element, hidden, argumen, callback) {
    const html = createImage(...argumen);
    const div = document.createElement('div');
    div.id = argumen[0].id;
    div.hidden = hidden;
    div.innerHTML = '';
    element.appendChild(div);
    for (const IMAGE of html) {
        div.appendChild(IMAGE);
        IMAGE.onclick = callback || async function() {
            await showMenu(argumen[0].type.value.toUpperCase());
        }
    }
}

function changeItem(id, cosmeticType) {
    if(cosmeticType.toLowerCase() === 'banner') return;
    fetch(`https://fortnitebtapi.herokuapp.com/api/account/party/item?array=["${id}"]&function=set${cosmeticType.toLowerCase().charAt(0).toUpperCase() + cosmeticType.toLowerCase().slice(1)}`, {credentials: 'include', method: "PUT", headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}});
}

function addVariant(array, cosmeticType) {
    fetch(`https://fortnitebtapi.herokuapp.com/api/account/party/item?array=["${system.items[cosmeticType].id}", ${JSON.stringify(array)}]&function=set${cosmeticType.toLowerCase().charAt(0).toUpperCase() + cosmeticType.toLowerCase().slice(1)}`, {
        credentials: 'include',
        method: "PUT",
        headers: {
            'Access-Control-Allow-Origin': "https://teenari.github.io"
        }
    });
}

function setDefaultItems() {
    system.items.default = {
        "outfit": system.items.cosmetics.outfit[Math.floor(Math.random() * system.items.cosmetics.outfit.length - 1) + 0],
        "backpack": system.items.cosmetics.backpack[Math.floor(Math.random() * system.items.cosmetics.backpack.length - 1) + 0],
        "pickaxe": system.items.cosmetics.pickaxe[Math.floor(Math.random() * system.items.cosmetics.pickaxe.length - 1) + 0],
        "banner": system.items.cosmetics.banner[Math.floor(Math.random() * system.items.cosmetics.banner.length - 1) + 0]
    }
    return system.items.default;
}

function sortItems() {
    for (const value of system.items.cosmetics) {
        if(!system.items.sort[value.type.value]) system.items.sort[value.type.value] = [];
        system.items.sort[value.type.value].push(value);
    }
    return system.items.cosmetics;
}

function categorizeItems(setDefaultItem) {
    for (const item of system.items.cosmetics) {
        system.items.conversions[item.type.value] = item.path.split('/Cosmetics/')[1] ? item.path.split('/Cosmetics/')[1].split('/')[0] : null;
        if(system.items.cosmetics[item.type.value]) continue;
        system.items.cosmetics[item.type.value] = system.items.cosmetics.filter(e => e.type.value === item.type.value);
    }
    if(setDefaultItem) {
        setDefaultItems();
    }
    return system.items.cosmetics;
}

async function setItems(items, itemss) {
    for (const key of Object.keys(items)) {
        const value = items[key];
        if(!itemss.sort[value.type.value]) itemss.sort[value.type.value] = [];
        itemss.sort[value.type.value].push(value);
        changeItem(value.id, value.type.value);
        itemss[key] = value;
        await createImageInElement(document.getElementById('fnItems'), false, [value, 0, 0, 'absolute', 100, 100, value.id, true]);
    }
    return true;
}

function last(character, data) {
    return data.substring(data.lastIndexOf(character) + 1, data.length);
}

function getImages(AthenaCosmeticLoadout) {
    return {
        character: `https://fortnite-api.com/images/cosmetics/br/${last('.', AthenaCosmeticLoadout.characterDef).replace(/'/g, '')}/icon.png`,
        backpack: `https://fortnite-api.com/images/cosmetics/br/${last('.', AthenaCosmeticLoadout.backpackDef).replace(/'/g, '')}/icon.png`,
        pickaxe: `https://fortnite-api.com/images/cosmetics/br/${last('.', AthenaCosmeticLoadout.pickaxeDef).replace(/'/g, '')}/icon.png`
    };
}

function setMembers() {
    const members = system.party.members;
    $('#members').html(null);
    for (const member of members) {
        const images = getImages(member.meta['Default:AthenaCosmeticLoadout_j'].AthenaCosmeticLoadout);
        $('#members')[0].innerHTML += `<div id="${member.id}" class="member"><img width="120" height="120" draggable="false" src="${system.settings.colorScheme[system.settings.currentScheme].back}"><img width="120" height="120" draggable="false" src="${images.character}"><img width="120" height="120" draggable="false" src="${system.settings.colorScheme[system.settings.currentScheme].faceplate}"><div>${member.displayName}</div></div>`;
        $(`#${member.id}.member`).click(async () => {
            $(document).unbind('click');
            createMenu(`MEMBER${member.id}`);
            const menu = $(`[id="MENU~MEMBER${member.id}"]`);
            let items = '';
            for (const key of Object.keys(images)) {
                const value = images[key];
                items += `<div class="member" style="width: 100px;"><img width="100" height="100" draggable="false" src="${system.settings.colorScheme[system.settings.currentScheme].back}"><img width="100" height="100" draggable="false" src="${value}"><img width="100" height="100" draggable="false" src="${system.settings.colorScheme[system.settings.currentScheme].faceplate}"></div>`
            }
            menu.html(`<div class="cosmetic">${member.displayName}<br><div style="font-size: 20px; margin: 10px;"><div style="position: relative;align-content: end;align-items: self-end;height: 108px;display: flex;">${items}</div><div id="kickPlayer" class="clickHereButton"${member.id === system.account.id ? ' style="border: 1px solid gray;color: gray;"' : ''}>Kick Player</div></div><div style="margin: 10px;font-size: 20px;">JOINED AT: ${member.joinedAt}</div><div style="margin: 10px;font-size: 20px;">ID: ${member.id}</div><div style="margin: 10px;font-size: 20px;">ROLE: ${member.role}</div></div>`);
            menu.fadeIn(250);
            $('#kickPlayer').click(() => {
                if(member.id === system.account.id) return;
            });
            menu.draggable({
                "containment": "window"
            });
            addCloseButton(menu, `MENU~MEMBER${member.id}~close`);
        });
    }
}

function sendMessage(id, message) {
    fetch(`http://fortnitebtapi.herokuapp.com/api/account/friends/send?id=${id}&message=${message}`, {credentials: 'include', method: "GET", headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}});
}

$(document).ready(async () => {
    const requestUser = await fetch('https://fortnitebtapi.herokuapp.com/api/user', {
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }).catch((e) => {
        console.log(e);
    });
    const user = await requestUser.json();
    if(user.authorization === false) {
        return window.location = 'https://discord.com/api/oauth2/authorize?client_id=735921855340347412&redirect_uri=https%3A%2F%2Ffortnitebtapi.herokuapp.com%2Fapi%2Fauthorize&response_type=code&scope=identify%20guilds';
    }

    if(Cookies.get('colorScheme')) changeColorScheme(Cookies.get('colorScheme'));
    else {
        Cookies.set('colorScheme', 'black');
        changeColorScheme('black');
    }

    switch((await fetch('https://fortnitebtapi.herokuapp.com/api/account/session/', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}})).status) {
        case 529: {
            console.log('DEBUG To much accounts used has been set.');
            return setLoadingText('All accounts have been used.<br>Please try again later.', true);
        };
    }

    system.source = new EventSource(`https://fortnitebtapi.herokuapp.com/api/account/session/start?auth=${(await (await fetch('https://fortnitebtapi.herokuapp.com/api/auth', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}})).json()).auth}`);
    system.source.onerror = (e) => {
        return setLoadingText('Error happend, cannot access the error.');
    }

    window.onbeforeunload = async () => {
        await fetch('https://fortnitebtapi.herokuapp.com/api/account/session/end', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}});
    };

    await new Promise((resolve) => {
        system.source.onmessage = (data) => {
            const json = JSON.parse(data.data);
            if(json.done) return resolve();
            setLoadingText(json.message);
        }
    });
    system.source.onmessage = (data) => {
        const json = JSON.parse(data.data);
        if(json.exit) return $('.message-container').fadeIn();
        if(json.event) {
            const data = json.data;
            const event = json.event;
            switch(event) {
                case 'refresh:party': {
                    system.party = json.party;
                    setMembers();
                    if(data.displayName && data.meta.schema && data.meta.schema['Default:FrontendEmote_j']) {
                        const emoteItemDef = JSON.parse(data.meta.schema['Default:FrontendEmote_j']).FrontendEmote.emoteItemDef;
                        if($(`#${data.id}.member`).children('img[type="emote"]')[0]) {
                            $(`#${data.id}.member`).children('img[type="emote"]')[0].remove();
                        }
                        if(emoteItemDef.trim() !== "" && emoteItemDef.trim() !== "None") {
                            const id = last('.', emoteItemDef).replace(/'/g, '');
                            const image = `https://fortnite-api.com/images/cosmetics/br/${id}/icon.png`;
                            $(`#${data.id}.member`).children('img')[$(`#${data.id}.member`).children('img').length - 2].outerHTML += `<img style="opacity: 0.5" width="120" height="120" draggable="false" src="${image}">`;
                        }
                    }
                } break;

                case 'friend:message': {
                    if(!system.messages.friends[data.author.id]) system.messages.friends[data.author.id] = [];
                    system.messages.friends[data.author.id].push(data);
                    if(system.messages.handler) system.messages.handler(data);
                } break;

                default: {
                    console.log(data);
                    console.log(`UNKNOWN EVENT ${event}`);
                } break;
            }
        }
    }
    system.account = await (await fetch('https://fortnitebtapi.herokuapp.com/api/account/', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}})).json();
    system.party = await (await fetch('https://fortnitebtapi.herokuapp.com/api/account/party', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}})).json();
    system.friends = await (await fetch('https://fortnitebtapi.herokuapp.com/api/account/friends', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}})).json();
    const timerSettings = {
        seconds: 60,
        minutes: 29
    }
    const timer = setInterval(() => {
        if(timerSettings.seconds === 0 && timerSettings.minutes !== 0) {
            timerSettings.seconds = 60;
            timerSettings.minutes --;
            document.getElementById('30MIN').innerText = `${timerSettings.minutes} minutes and ${timerSettings.seconds} seconds left`;
        }
        if(timerSettings.seconds === 0 && timerSettings.minutes === 0) {
            document.getElementById('30MIN').innerText = `None minutes left`;
            clearInterval(timer);
        }
        if(timerSettings.seconds !== 0) {
            timerSettings.seconds --;
            document.getElementById('30MIN').innerText = `${timerSettings.minutes} minutes and ${timerSettings.seconds} seconds left`;
        }
    }, 1000);
    $('#username')[0].innerText = system.account.displayName;
    setLoadingText('Loading account');
    setLoadingText('Loading cosmetics');
    const cos = (await (await fetch('https://fortnite-api.com/v2/cosmetics/br')).json()).data;
    system.items.cosmetics = cos;
    setLoadingText('Categorizing cosmetics');
    categorizeItems(true);
    sortItems();
    setLoadingText('Creating default images');
    await setItems(system.items.default, system.items);
    setMembers();
    await createImageInElement(document.getElementById('fnItems'), false, [{
        images: {
            icon: 'https://gamepedia.cursecdn.com/fortnite_gamepedia/f/f2/ScenarioEmoteIcon.png'
        },
        id: 'Emote'
    }, 100, 100, 'absolute', 100, 100, 'Emote', true], async () => {
        createMenu('cosmeticMenu');
        const menu = $('[id="MENU~cosmeticMenu"]');
        $(document).unbind('click');
        menu[0].innerHTML = `<div class="cosmetic">EMOTE<br><div style="font-size: 20px; margin: 10px;">Select item by icon<div id="selectItem" class="clickHereButton">Click Here</div></div><div style="font-size: 20px; margin: 0px;">Emote ID</div><textarea placeholder="Item ID Here" id="cosmeticID"></textarea><div class="clickHereButton" id="SaveID" style="padding: 1px;font-size: 20px;">Save</div></div>`;
        menu.fadeIn(250);
        menu.draggable({
            "containment": "window"
        });
        $('#SaveID').click(async () => {
            await hideMenu(menu);
        });
        $('#selectItem').click(async () => {
            let selectedItem = null;
            await new Promise((resolve) => setTimeout(resolve, 1));
            menu.html(`<div class="cosmetic">${system.settings.currentScheme === 'partyroyale' ? '<div class="textBackground gradient">' : ''}PICK YOUR EMOTE${system.settings.currentScheme === 'partyroyale' ? '</div>' : '<br>'}<div><div class="clickHereButton" style="padding: 1px;font-size: 25px;cursor: auto;height: auto;position: relative;top: 10px;"><textarea placeholder="Search Here" style="margin: 0px;width: 300px;height: 13px;resize: none;font-size: 20px;outline: none;border: none;overflow: hidden;font-family: t;position: relative;" id="search"></textarea></div><br><h1 style="border: 1px solid black;margin: 0px;"></h1><div id="cosmetics" style="overflow-y: scroll;width: 340px;height: 300px;"></div><div class="clickHereButton" id="SaveAvatar" style="padding: 1px;font-size: 20px;">EMOTE</div></div></div>`);
            $('#search').keyup(() => {
                const searchQuery = $('#search').val();
                for (const element of [...$('#cosmetics').children()].filter(e => !e.children[3].innerText.startsWith(searchQuery))) {
                    element.hidden = true;
                }
                for (const element of [...$('#cosmetics').children()].filter(e => e.children[3].innerText.startsWith(searchQuery))) {
                    element.hidden = false;
                }
            });
            for (const item of system.items.sort.emote) {
                const div = document.createElement("div");
                div.id = `ITEM/${item.id}`;
                for (const src of [{
                    src: system.settings.colorScheme[system.settings.currentScheme].back
                }, {
                    src: item.images.icon,
                    position: 'relative',
                    right: '100px'
                }, {
                    src: system.settings.colorScheme[system.settings.currentScheme].faceplate,
                    position: 'relative',
                    right: '200px'
                }]) {
                    const IMAGE = document.createElement("IMG");
                    if(src.src || src.back) IMAGE.width = 100;
                    if(src.src || src.back) IMAGE.height = 100;
                    IMAGE.draggable = false;
                    IMAGE.style.cursor = 'pointer';
                    if(src.src) IMAGE.src = src.src;
                    if(src.position) IMAGE.style.position = src.position;
                    if(src.right) IMAGE.style.right = src.right;
                    const element = $('#cosmetics')[0].appendChild(div);
                    ($(`[id="ITEM/${item.id}"]`)[0].appendChild(IMAGE)).onclick = async (e) => {
                        if(selectedItem === item) return;
                        if(selectedItem && selectedItem !== item) {
                            $(`[src="${system.settings.colorScheme.faceplate}"]`)[0].src = system.settings.colorScheme[system.settings.currentScheme].faceplate;
                        }
                        e.srcElement.src = system.settings.colorScheme.faceplate;
                        selectedItem = item;
                    }
                    if(src.src.includes('faceplate.png')) {
                        IMAGE.outerHTML += `<div style="left: 120px;bottom: 80px;position: relative;">${item.name}</div>`;
                        element.onclick = async () => {
                            if(selectedItem === item) return;
                            if(selectedItem && selectedItem !== item) {
                                $(`[src="${system.settings.colorScheme.faceplate}"]`)[0].src = system.settings.colorScheme[system.settings.currentScheme].faceplate;
                            }
                            $(`[id="ITEM/${item.id}"]`).children()[2].src = system.settings.colorScheme.faceplate;
                            selectedItem = item;
                        }
                    }
                }
            }
            $('#SaveAvatar').click(async () => {
                if(!selectedItem) return;
                changeItem(selectedItem.id, 'emote');
                await hideMenu(menu);
            });
        });
        addCloseButton(menu, 'MENU~cosmeticMenu~close');
    });
    $('#InformationButton').children().click(async () => {
        createMenu('information');
        const menu = $('[id="MENU~information"]');
        $(document).unbind('click');
        menu[0].innerHTML = `<div class="cosmetic">Information<br><div id="FriendsButton" class="clickHereButton" style="padding: 3px;font-size: 20px;margin: 10px;">Friends</div><div id="ColorSchemeButton" class="clickHereButton textBackground gradient" style="padding: 3px;font-size: 20px;margin: 10px;">Color Scheme</div></div>`;
        menu.fadeIn(250);
        menu.draggable({
            "containment": "window"
        });
        $('#FriendsButton').click(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1));
            menu[0].innerHTML = '';
            for (const friend of system.friends) {
                menu[0].innerHTML += `<div id="${friend.id}" class="friend">${friend.displayName}<div style="font-size: 13px;position: absolute;left: 2vh;top: 4vh;">${friend.presence.status ? friend.presence.status : 'None'}</div></div>`;
            }
            menu[0].innerHTML = `<div class="cosmetic">FRIENDS<br><div id="sub-menu" class="cosmetic"></div><div id="friends" style="display: inline-block;padding: 15px;">${menu[0].innerHTML}</div></div>`;
            $('#friends').children().hover(
                (e) => $(`#${e.currentTarget.id}`).stop().animate({ backgroundColor: 'white', color: 'black' }, 100),
                (e) => $(`#${e.currentTarget.id}`).stop().animate({ backgroundColor: 'black', color: 'white' }, 100)
            )
            $('#friends').children().click(async (e) => {
                createMenu(`SUBMENU-FRIENDS-${e.currentTarget.id}`);
                let customName = `MENU~SUBMENU-FRIENDS-${e.currentTarget.id}-`
                const submenu = $(`[id="MENU~SUBMENU-FRIENDS-${e.currentTarget.id}"]`);
                submenu[0].innerHTML = `<div class="cosmetic">${(system.friends.find(friend => friend.id === e.currentTarget.id)).displayName}<br><div style="position: relative;"><div id="${customName}whisperButton" class="submenuButton">Whisper</div><br><div class="submenuButton">Remove Friend</div><br><div class="submenuButton">Invite To Party</div></div></div>`;
                submenu.fadeIn();
                submenu.draggable();
                $(`[id="${customName}whisperButton"]`).click(async () => {
                    submenu[0].innerHTML = `<div class="cosmetic">${(system.friends.find(friend => friend.id === e.currentTarget.id)).displayName}<br><div id="${customName}friendMessages" style="position: relative;margin: 10px;overflow: auto;height: 235px;width: 184px;background-color: black;border-radius: 5px;color: white;font-size: 17px;padding: 10px;"><div>[System] Start of messages.</div></div></div><textarea id="${customName}sendMessage" style="position: absolute;top: 43vh;left: 5vh;border: none;overflow: auto;outline: none;-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;resize: none;background-color: white;border-radius: 5px;font-family: t;font-size: 16px;overflow: auto;padding: -18px;width: 170px;height: 16px;"></textarea>`;
                    if(system.messages.friends[e.currentTarget.id]) for (const message of system.messages.friends[e.currentTarget.id]) {
                        $(`[id="${customName}sendMessage"]`).before(`<div>[${message.author.displayName}] ${message.content}</div>`);
                    }
                    system.messages.handler = (data) => {
                        $(`[id="${customName}sendMessage"]`).before(`<div>[${data.author.displayName}] ${data.content}</div>`);
                    }
                    $(`[id="${customName}sendMessage"]`).keydown((event) => {
                        if(event.keyCode === 13 && !event.shiftKey && $(`[id="${customName}sendMessage"]`).val().trim() !== '') {
                            event.stopPropagation();
                            sendMessage(e.currentTarget.id, $(`[id="${customName}sendMessage"]`).val());
                            if(!system.messages.friends[e.currentTarget.id]) system.messages.friends[e.currentTarget.id] = [];
                            system.messages.friends[e.currentTarget.id].push({
                                content: $(`[id="${customName}sendMessage"]`).val(),
                                sentAt: new Date().toISOString(),
                                author: {
                                    displayName: system.account.displayName,
                                    id: system.account.id
                                }
                            });
                            $(`[id="${customName}sendMessage"]`).before(`<div>[${system.account.displayName}] ${$(`[id="${customName}sendMessage"]`).val()}</div>`);
                            $(`[id="${customName}sendMessage"]`).val('');
                        }
                    });
                    addCloseButton(submenu, `MENU~${customName}~close`);
                });
                addCloseButton(submenu, `MENU~${customName}~close`);
            });
            addCloseButton(menu, `MENU~information~close`);
        });
        $('[id="ColorScheme#black"]').hover(() => {
            $(`#${this.id}`).stop().animate({backgroundColor:'black'}, 300);
        });
        $('#ColorSchemeButton').click(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1));
            menu[0].innerHTML = '';
            for (const colorScheme of Object.keys(system.settings.colorScheme).filter(e => e !== 'faceplate')) {
                menu[0].innerHTML += `<div style="margin: 10px; cursor: pointer;display: inline-block;border-radius: 5px;" id="ColorScheme#${colorScheme}"><div style="margin: 17px;width: 75px;">${colorScheme}</div></div>`;
                $(`[id="ColorScheme#${colorScheme}"]`).hover(
                    () => $(`[id="ColorScheme#${colorScheme}"]`).stop().animate({backgroundColor:'black', color: 'white'}, 100),
                    () => $(`[id="ColorScheme#${colorScheme}"]`).stop().animate({backgroundColor:'white', color: 'black'}, 100)
                );
            }
            menu[0].innerHTML = `<div class="cosmetic"><div id="FriendsButton" class="clickHereButton" style="padding: 3px;font-size: 20px;margin: 10px;">Friends</div><div class="textBackground gradient">Pick your Color Scheme</div><div>${menu[0].innerHTML}</div></div>`;
            for (const colorScheme of Object.keys(system.settings.colorScheme).filter(e => e !== 'faceplate')) {
                $(`[id="ColorScheme#${colorScheme}"]`).click(async () => {
                    changeColorScheme(colorScheme);
                    await hideMenu(submenu);
                });
            }
        });
        addCloseButton(menu, 'MENU~information~close');
    });
    setLoadingText('Starting');
    $('#fortnite').fadeOut(300);
    $('.menu-container').css('left', '300vh').show().animate({left: '58.5px'}, 700);
    $('#avatar').css('position', 'absolute').css('left', '-500px').show().animate({left: 10}, 700);
    $('.members-container').fadeIn();
    stopText();
    await new Promise((resolve) => setTimeout(resolve, 300));
    $('#DATA').fadeIn();
    $('#fortnite').css('padding', '0px');
});