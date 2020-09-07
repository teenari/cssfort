let LoadingText = '';
let stream;
const items = {
    "outfit": null,
    "backpack": null,
    "pickaxe": null,
    "banner": null,
    "conversions": {},
    "default": {},
    "variants": {},
    "cosmetics": {},
    "sort": {}
}

async function hideMenu() {
    const menu = $('#menu');
    menu.fadeOut(250);
    await new Promise((resolve) => setTimeout(resolve, 250));
    menu[0].innerHTML = '';
    menu[0].hidden = true;
}

async function showMenu(cosmeticType) {
    const menu = $('#menu');
    const id = items[cosmeticType.toLowerCase()].id;
    $(document).unbind('click');
    menu[0].innerHTML = `<div class="cosmetic">${cosmeticType}<br><div style="font-size: 20px; margin: 10px;">Select item by icon<div id="selectItem" class="clickHereButton">Click Here</div></div><div style="font-size: 20px; margin: 0px;">${id}</div><textarea placeholder="Item ID Here" id="cosmeticID"></textarea><div class="clickHereButton" id="SaveID" style="padding: 1px;font-size: 20px;">Save</div><div style="font-size: 20px; margin: 10px;">Select Variant by icon</div><div id="selectVariant" ${!Array.isArray(items[cosmeticType.toLowerCase()].variants) ? 'disabled' : ''} class="clickHereButton" style="font-size: 22px;margin: -2px;">${Array.isArray(items[cosmeticType.toLowerCase()].variants) ? 'Click Here' : 'Item does not have variant option'}</div></div>`;
    menu.fadeIn(250);
    await new Promise((resolve) => setTimeout(resolve, 250));
    $('#selectVariant').click(async () => {
        if(!items[cosmeticType.toLowerCase()].variants) return;
        let selectedVariants = [];
        await new Promise((resolve) => setTimeout(resolve, 1));
        $('#menu').html(`<div class="cosmetic">PICK YOUR VARIANT<div class="clickHereButton" style="padding: 1px;font-size: 25px;cursor: auto;height: auto;position: relative;top: 10px;"><textarea placeholder="Search Here" style="margin: 0px;width: 300px;height: 13px;resize: none;font-size: 20px;outline: none;border: none;overflow: hidden;font-family: t;position: relative;" id="search"></textarea></div><br><h1 style="border: 1px solid black;margin: 0px;"></h1><div id="cosmetics" style="overflow-y: scroll;width: 340px;height: 300px;"></div><div class="clickHereButton" id="SaveVariant" style="padding: 1px;font-size: 20px;">SAVE</div></div>`);
        $('#search').keyup(() => {
            const searchQuery = $('#search').val();
            for (const element of [...$('#cosmetics').children()].filter(e => !e.children[3].innerText.startsWith(searchQuery))) {
                element.hidden = true;
            }
            for (const element of [...$('#cosmetics').children()].filter(e => e.children[3].innerText.startsWith(searchQuery))) {
                element.hidden = false;
            }
        });
        for (const item of items[cosmeticType.toLowerCase()].variants) {
            for (const variant of item.options) {
                const div = document.createElement("div");
                div.id = `VARIANT/${variant.tag}#${variant.name}`;
                for (const src of [{
                    src: 'back.png'
                }, {
                    src: variant.image,
                    position: 'relative',
                    right: '100px'
                }, {
                    src: 'faceplate.png',
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
                    if(src.src === 'faceplate.png') {
                        IMAGE.outerHTML += `<div style="left: 120px;bottom: 80px;position: relative;">${variant.name}</div>`;
                        element.onclick = async (e) => {
                            if(selectedVariants.find((e) => {
                                return e.image === variant.image;
                            })) {
                                selectedVariants = selectedVariants.filter((e) => {
                                    return e.image !== variant.image;
                                });
                                $(`[id="VARIANT/${variant.tag}#${variant.name}"]`).children()[2].src = 'faceplate.png';
                            }
                            else {
                                selectedVariants.push({channel: item.channel, tag: variant.tag, name: variant.name, image: variant.image});
                                $(`[id="VARIANT/${variant.tag}#${variant.name}"]`).children()[2].src = 'selectedFaceplate.png';
                            }
                        }
                    }
                }
            }
        }
        if(items.variants[cosmeticType]) for (const variant of items.variants[cosmeticType]) {
            $(`[id="VARIANT/${variant.tag}#${variant.name}"]`).children()[2].src = 'selectedFaceplate.png';
            selectedVariants.push(variant);
        }
        $('#SaveVariant').click(async () => {
            if(selectedVariants.length === 0) return;
            if(!items.variants[cosmeticType]) items.variants[cosmeticType] = [];
            items.variants[cosmeticType] = selectedVariants;
            const img = $(`#${id}`)[0].children[0];
            if($(`#${id}`)[0].children[2].outerHTML.includes('opacity: 0.7')) $(`#${id}`)[0].children[2].remove();
            $(`#${id}`)[0].children[1].outerHTML += `<img width="${img.width}" height="${img.height}" draggable="false" src="${selectedVariants[selectedVariants.length - 1].image}" style="cursor: pointer;position: absolute;opacity: 0.7;top: ${img.style.top};left: ${img.style.left};">`;
            await hideMenu();
        });
    });
    $('#selectItem').click(async () => {
        let selectedItem = null;
        await new Promise((resolve) => setTimeout(resolve, 1));
        $('#menu').html(`<div class="cosmetic">PICK YOUR ${cosmeticType}<div class="clickHereButton" style="padding: 1px;font-size: 25px;cursor: auto;height: auto;position: relative;top: 10px;"><textarea placeholder="Search Here" style="margin: 0px;width: 300px;height: 13px;resize: none;font-size: 20px;outline: none;border: none;overflow: hidden;font-family: t;position: relative;" id="search"></textarea></div><br><h1 style="border: 1px solid black;margin: 0px;"></h1><div id="cosmetics" style="overflow-y: scroll;width: 340px;height: 300px;"></div><div class="clickHereButton" id="SaveAvatar" style="padding: 1px;font-size: 20px;">SAVE</div></div>`);
        $('#search').keyup(() => {
            const searchQuery = $('#search').val();
            for (const element of [...$('#cosmetics').children()].filter(e => !e.children[3].innerText.startsWith(searchQuery))) {
                element.hidden = true;
            }
            for (const element of [...$('#cosmetics').children()].filter(e => e.children[3].innerText.startsWith(searchQuery))) {
                element.hidden = false;
            }
        });
        for (const item of items.cosmetics[cosmeticType.toLowerCase()]) {
            const div = document.createElement("div");
            div.id = `ITEM/${item.id}`;
            for (const src of [{
                src: 'back.png'
            }, {
                src: item.images.icon,
                position: 'relative',
                right: '100px'
            }, {
                src: 'faceplate.png',
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
                        $('[src="selectedFaceplate.png"]')[0].src = 'faceplate.png';
                    }
                    e.srcElement.src = 'selectedFaceplate.png';
                    selectedItem = item;
                }
                if(src.src === 'faceplate.png') {
                    IMAGE.outerHTML += `<div style="left: 120px;bottom: 80px;position: relative;">${item.name}</div>`;
                    element.onclick = async () => {
                        if(selectedItem === item) return;
                        if(selectedItem && selectedItem !== item) {
                            $('[src="selectedFaceplate.png"]')[0].src = 'faceplate.png';
                        }
                        $(`[id="ITEM/${item.id}"]`).children()[2].src = 'selectedFaceplate.png';
                        selectedItem = item;
                    }
                }
            }
        }
        $('#SaveAvatar').click(async () => {
            items[cosmeticType.toLowerCase()] = selectedItem;
            const img = $(`#${id}`)[0].children[0];
            $(`#${id}`)[0].id = selectedItem.id;
            $(`#${selectedItem.id}`)[0].innerHTML = '';
            for (const image of createImage(selectedItem, img.style.top.split('px')[0], img.style.left.split('px')[0], 'absolute', img.width, img.height)) {
                $(`#${selectedItem.id}`).append(image);
                image.onclick = async () => {
                    await showMenu(selectedItem.type.value.toUpperCase());
                }
            }
            items.variants[cosmeticType] = [];
            await hideMenu();
        });
    });
    $('#SaveID').click(async () => {
        if($('[id="cosmeticID"]').val().trim() === "" || !items.cosmetics.find(e => e.id === $('[id="cosmeticID"]').val())) return;
        const item = items.cosmetics.find(e => e.id === $('[id="cosmeticID"]').val());
        items[cosmeticType.toLowerCase()] = item;
        const img = $(`#${id}`)[0].children[0];
        $(`#${id}`)[0].id = $('[id="cosmeticID"]').val();
        $(`#${$('[id="cosmeticID"]').val()}`)[0].innerHTML = '';
        for (const image of createImage(item, img.style.top.split('px')[0], img.style.left.split('px')[0], 'absolute', img.width, img.height)) {
            $(`#${$('[id="cosmeticID"]').val()}`).append(image);
            image.onclick = async () => {
                await showMenu(item.type.value.toUpperCase());
            }
        }
        await hideMenu();
    });
    menu.draggable({
        "containment": "window"
    });
    await new Promise((resolve) => setTimeout(resolve, 300));
    $(document).click(async (e) => { 
        if(!$(event.target).closest('#menu').length && $('#menu').is(":visible")) {
            await hideMenu();
            $(document).unbind('click');
        }        
    });
}

function setLoadingText(text) {
    LoadingText = text;
    let dots = 0;
    const inv = setInterval(() => {
        if(LoadingText !== text) clearInterval(inv);
        dots += 1;
        if(dots === 4) dots = 0;
        $('#status').html(text + '.'.repeat(dots));
    }, 500);
}

function stopText() {
    LoadingText = ' '.repeat(1000);
}

function createImage(item, top, left, position, width=100, height=100, right=null, id=null) {
    const IMAGES = [];

    for (const src of [`back.png`, item.images.icon, `faceplate.png`]) {
        const IMAGE = document.createElement("IMG");
        IMAGE.width = width;
        IMAGE.height = height;
        IMAGE.draggable = false;
        IMAGE.style.cursor = 'pointer';
        IMAGE.src = src;
        if(position) IMAGE.style.position = position;
        if(id) IMAGE.id = item.id;
        if(top) IMAGE.style.top = `${top}px`;
        if(left) IMAGE.style.left = `${left}px`;
        if(right) IMAGE.style.left = `${right}px`;
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
            await showMenu(argumen[0].type.value.toUpperCase(), argumen[0].id);
        }
    }
}

function changeItem(id, cosmeticType) {
    if(cosmeticType.toLowerCase() === 'banner') return;
    fetch(`http://localhost:5000/item?path=/Game/Athena/Items/Cosmetics/${items.conversions[cosmeticType.toLowerCase()]}/${id}.${id}&function=set${cosmeticType.toLowerCase().charAt(0).toUpperCase() + cosmeticType.toLowerCase().slice(1)}`);
}

$(document).ready(async () => {
    setLoadingText('Loading account');
    // stream = new EventSource('http://localhost:5000/streaming');
    // const account = await new Promise((resolve) => {
    //     stream.onmessage = (e) => {
    //         resolve((JSON.parse(e.data)).account);
    //         stream.onmessage = null;
    //     }
    // });
    // $('#username')[0].innerText = account.name;
    // $('#partyID')[0].innerText = account.partyID;
    // stream.onmessage = (e) => {
    //     const type = ((JSON.parse(e.data))).type;
    //     switch(type) {
    //     }
    // }
    setLoadingText('Loading cosmetics');
    const cos = (await (await fetch('https://fortnite-api.com/v2/cosmetics/br')).json()).data;
    items.cosmetics = cos;
    setLoadingText('Categorizing cosmetics');
    for (const item of items.cosmetics) {
        items.conversions[item.type.value] = item.path.split('/Cosmetics/')[1] ? item.path.split('/Cosmetics/')[1].split('/')[0] : null;
        if(items.cosmetics[item.type.value]) continue;
        items.cosmetics[item.type.value] = items.cosmetics.filter(e => e.type.value === item.type.value);
    }
    console.log(items.cosmetics.skin)
    setLoadingText('Creating default images');
    items.default = {
        "outfit": items.cosmetics.outfit[Math.floor(Math.random() * items.cosmetics.outfit.length - 1) + 0],
        "backpack": items.cosmetics.backpack[Math.floor(Math.random() * items.cosmetics.backpack.length - 1) + 0],
        "pickaxe": items.cosmetics.pickaxe[Math.floor(Math.random() * items.cosmetics.pickaxe.length - 1) + 0],
        "banner": items.cosmetics.banner[Math.floor(Math.random() * items.cosmetics.banner.length - 1) + 0]
    }
    let top = 6;
    let left = 6;
    let width = 100;
    let height = 100;
    for (const value of items.cosmetics) {
        if(!items.sort[value.type.value]) items.sort[value.type.value] = [];
        items.sort[value.type.value].push(value);
    }
    for (const key of Object.keys(items.default)) {
        const value = items.default[key];
        if(!items.sort[value.type.value]) items.sort[value.type.value] = [];
        items.sort[value.type.value].push(value);
        changeItem(value.id, value.type.value);
        items[key] = value;
        await createImageInElement(document.getElementById('fnItems'), false, [value, top, left, 'absolute', width, height, value.id]);
        top += 105;
        width = width - 10;
        height = height - 10;
    }
    await createImageInElement(document.getElementById('fnItems'), false, [{
        images: {
            icon: 'https://gamepedia.cursecdn.com/fortnite_gamepedia/f/f2/ScenarioEmoteIcon.png'
        },
        id: 'Emote'
    }, top - 20, left, 'absolute', width - 10, height - 1, 'Emote'], async (e) => {
        const menu = $('#menu');
        $(document).unbind('click');
        menu[0].innerHTML = `<div class="cosmetic">EMOTE<br><div style="font-size: 20px; margin: 10px;">Select item by icon<div id="selectItem" class="clickHereButton">Click Here</div></div><div style="font-size: 20px; margin: 0px;">Emote ID</div><textarea placeholder="Item ID Here" id="cosmeticID"></textarea><div class="clickHereButton" id="SaveID" style="padding: 1px;font-size: 20px;">Save</div></div>`;
        menu.fadeIn(250);
        menu.draggable({
            "containment": "window"
        });
        await new Promise((resolve) => setTimeout(resolve, 300));
        $(document).click(async (e) => { 
            if(!$(event.target).closest('#menu').length && $('#menu').is(":visible")) {
                await hideMenu();
                $(document).unbind('click');
            }        
        });
        $('#SaveID').click(async () => {
            await hideMenu();
        });
        $('#selectItem').click(async () => {
            let selectedItem = null;
            await new Promise((resolve) => setTimeout(resolve, 1));
            $('#menu').html(`<div class="cosmetic">PICK YOUR EMOTE<div class="clickHereButton" style="padding: 1px;font-size: 25px;cursor: auto;height: auto;position: relative;top: 10px;"><textarea placeholder="Search Here" style="margin: 0px;width: 300px;height: 13px;resize: none;font-size: 20px;outline: none;border: none;overflow: hidden;font-family: t;position: relative;" id="search"></textarea></div><br><h1 style="border: 1px solid black;margin: 0px;"></h1><div id="cosmetics" style="overflow-y: scroll;width: 340px;height: 300px;"></div><div class="clickHereButton" id="SaveAvatar" style="padding: 1px;font-size: 20px;">EMOTE</div></div>`);
            $('#search').keyup(() => {
                const searchQuery = $('#search').val();
                for (const element of [...$('#cosmetics').children()].filter(e => !e.children[3].innerText.startsWith(searchQuery))) {
                    element.hidden = true;
                }
                for (const element of [...$('#cosmetics').children()].filter(e => e.children[3].innerText.startsWith(searchQuery))) {
                    element.hidden = false;
                }
            });
            for (const item of items.sort.emote) {
                const div = document.createElement("div");
                div.id = `ITEM/${item.id}`;
                for (const src of [{
                    src: 'back.png'
                }, {
                    src: item.images.icon,
                    position: 'relative',
                    right: '100px'
                }, {
                    src: 'faceplate.png',
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
                            $('[src="selectedFaceplate.png"]')[0].src = 'faceplate.png';
                        }
                        e.srcElement.src = 'selectedFaceplate.png';
                        selectedItem = item;
                    }
                    if(src.src === 'faceplate.png') {
                        IMAGE.outerHTML += `<div style="left: 120px;bottom: 80px;position: relative;">${item.name}</div>`;
                        element.onclick = async () => {
                            if(selectedItem === item) return;
                            if(selectedItem && selectedItem !== item) {
                                $('[src="selectedFaceplate.png"]')[0].src = 'faceplate.png';
                            }
                            $(`[id="ITEM/${item.id}"]`).children()[2].src = 'selectedFaceplate.png';
                            selectedItem = item;
                        }
                    }
                }
            }
            $('#SaveAvatar').click(async () => {
                await hideMenu();
            });
        });
    });
    setLoadingText('Starting');
    $('[id="items"]').fadeOut(300);
    $('#copyright').css('position', 'absolute').animate({right: 80}, 700).animate({bottom: 10}, 700);
    $('.fn-container').css('left', '300vh').show().animate({left: '146vh'}, 700);
    $('#avatar').css('position', 'absolute').css('left', '-500px').show().animate({left: 10}, 700);
    stopText();
});