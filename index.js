var content = document.getElementById('content');
var stage = new createjs.Stage('page');
var canvas = document.getElementById('page');

// 仓库到数字
var roomData = [1, 2, 3, 4, 5];
//汽车数字
var carData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

setInterval(function () {
    content.style.backgroundImage = 'url("'+canvas.toDataURL('image/png')+'")';
}, 1000 / 120);

createjs.Ticker.on('tick', function (e) {
    if (!e.paused) {
        stage.update();
    }
});

createjs.Ticker.setFPS(30);

var get = createjs.Tween.get;

// 加载完成
function complete() {
    var bg = addImg('bg');
    canvas.width = bg.getBounds().width;
    canvas.height = bg.getBounds().height;

    var position = [
        {x: 480, y: 210, name: 'c3', tox: 210, time: 2000, deg: -30,
            to: [
                {name: 'c1', tox: -100, time: 1500, deg: 30},
                ]
        },
        {x: 960, y: 490, name: 'c3', tox: 630, time: 2000, deg: -30,
            to: [
                {name: 'c3', tox: 630, time: 1000, deg: 30},
                ]
        },
        {x: -100, y: 170, name: 'c3', tox: -100, time: 800, deg: -30,
            to: [
                {name: 'c3', tox: 950, time: 1, deg: 0},
                {name: 'c3', tox: 480, time: 3000, deg: -30},
            ]
        },
        {x: -100, y: 150, name: 'c1', tox: -100, time: 1000, deg: 0,
            to: [
                {name: 'c1', tox: 1310, time: 1, deg: 0},
                {name: 'c1', tox: 1130, time: 2000, deg: 30},
                {name: 'c3', tox: 1080, time: 500, deg: -30},
            ]
        },
        {x: 940, y: -100, name: 'c4', tox: 940, time: 500, deg: -30,
            to: [
                {name: 'c4', tox: 1535, time: 3000, deg: -30},
                {name: 'c4', tox: 1535, time: 500, deg: -30},
            ]
        },
        {x: 1560, y: 245, name: 'c4', tox: 1630, time: 500, deg: -30,
            to: [
                {name: 'c2', tox: 1790, time: 1000, deg: 30},
                {name: 'c4', tox: 2000, time: 500, deg: -30},
            ]
        },
        {x: -100, y: 640, name: 'c2', tox: -100, time: 600, deg: 30,
            to: [
                {name: 'c2', tox: 800, time: 1, deg: 0},
                {name: 'c2', tox: 1130, time: 2000, deg: 30},
                {name: 'c4', tox: 1300, time: 1000, deg: -30}
            ]
        },
        {x: 1300, y: 550, name: 'c4', tox: 2000, time: 3000, deg: -30},
        {x: 1300, y: 970, name: 'c3', tox: 1115, time: 2000, deg: -30,
            to: [
                {name: 'c1', tox: 920, time: 1600, deg: 30},
                {name: 'c3', tox: 840, time: 400, deg: -30}
            ]
        },
        {x: 800, y: 910, name: 'c3', tox: 545, time: 1200, deg: -30,
            to: [
                {name: 'c1', tox: 190, time: 2000, deg: 30},
                {name: 'c4', tox: 500, time: 800, deg: -30},
            ]
        },
    ]

    animation(position);
    setInterval(function () {
        animation(position)
    }, 9000);

}

function animation(position) {
    for(var i = 0; i < carData.length; i ++){
        var p = position[i];
        if(p){
            moveCar(Object.assign({code: carData[i]}, p), p.to || null, Object.assign({code: carData[i]}, p));
        }
    }

    addImg('room');
    addRoomCode();
}

function moveCar(data, to, init) {

    var car = setMove(addImg(data.name), data);
    setMove(addImg('box'), data, {x: 30, y: -50});
    var code = addCode(data.code, 26, data.x, data.y);
    var move = code.move;
    setMove(code.view, data, {x: 50 + move.x, y: -35 + move.y});

    if(to && to.length){
        var d = to[0];
        var newTo = ([]).concat(to);
        newTo.shift();
        var wait = data.wait ? (data.wait + data.time) : data.time;
        moveCar(Object.assign(data, d, car, {wait: wait}), newTo, init);
    }
}

function setMove(view, data, move){

    move = move || {x: 0, y: 0};
    view.x = data.x + move.x;
    view.y = data.y + move.y;
    view.alpha = 0;
    var toX = data.tox + move.x;
    var toY = (view.x - toX) * Math.tan(data.deg * Math.PI / 180) + view.y;
    get(view)
        .wait(data.wait * 3)
        .to({alpha: 1})
        .to({x:toX, y: toY}, data.time * 3)
        .call(function () {
            stage.removeChild(view);
        });
    return {x: toX, y: toY};
}

//添加房子数字
function addRoomCode() {
    var position = [
        {x: 578, y: 120},
        {x: 1010, y: 80},
        {x: 1585, y: 125},
        {x: 1315, y: 447},
        {x: 875, y: 832},
    ];
    for(var i = 0; i < roomData.length; i++){
        position[i] && addCode(roomData[i], 42, position[i].x, position[i].y);
    }
}

function addCode(text, size, x, y) {
    var text = new createjs.Text(text, size + "px ''", "#fff");
    var b = text.getBounds();
    text.x = x - (b.width / 2);
    text.y = y - (b.height / 2);
    stage.addChild(text);
    return {view: text, move: {x: -(b.width / 2), y: - (b.height / 2)}};
}

function addImg(key) {
    var img = new createjs.Bitmap(loader.getResult(key));
    stage.addChild(img);
    return img;
}

var loader = new createjs.LoadQueue(false, './image/');
loader.addEventListener('complete', complete);

loader.loadManifest([
    {src: 'bg.png', id: 'bg'},
    {src: 'room.png', id: 'room'},
    {src: 'box.png', id: 'box'},
    {src: 'c1.png', id: 'c1'},
    {src: 'c2.png', id: 'c2'},
    {src: 'c3.png', id: 'c3'},
    {src: 'c4.png', id: 'c4'}
]);
