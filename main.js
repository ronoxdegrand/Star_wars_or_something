let scene, camera, renderer, ship, container, enemy = [], missile = [], pup = [], enspeed = [];
let xspeed = 0, zspeed = 0;
let missilecount = 0;
let score = 0, health = 100000;

function envinit() {
    container = document.querySelector('.scene');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    camera.position.set(0, 40, 50);

    camera.rotation.x = -0.4;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(0, 20, -200);
    scene.add(light);
}

/*function boxinit() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const texture = new THREE.TextureLoader().load('textures/crate2.png');
    const material = new THREE.MeshPhongMaterial({ map: texture, flatshading: THREE.FlatShading });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}*/

function shipinit() {
    let loader = new THREE.GLTFLoader();
    loader.load('newship/scene.gltf', function (gltf) {
        scene.add(gltf.scene);
        ship = gltf.scene.children[0];

        ship.rotation.z = 3.1415;

        ship.scale.x = 0.12;
        ship.scale.y = 0.12;
        ship.scale.z = 0.12;

        renderer.render(scene, camera);
    });
}

function enemyinit(num) {
    let loader = new THREE.GLTFLoader();
    loader.load('newship2/scene.gltf', function (gltf) {
        scene.add(gltf.scene);
        enemy[num] = gltf.scene.children[0];

        maxEnemyWidth = (Math.random() - 0.5) * (window.innerWidth / 100) * 6;

        enemy[num].position.set(maxEnemyWidth, 0, (num * 100) - 1228);

        enemy[num].scale.x = 0.4;
        enemy[num].scale.y = 0.4;
        enemy[num].scale.z = 0.4;

        if (Math.random() > 0.5)
            enspeed[num] = 0.15
        else enspeed[num] = -0.15

        renderer.render(scene, camera);
    });
}

function pupinit(num) {
    let loader = new THREE.GLTFLoader();
    loader.load('pup/scene.gltf', function (gltf) {
        scene.add(gltf.scene);
        pup[num] = gltf.scene.children[0];

        maxPupWidth = (Math.random() - 0.5) * (window.innerWidth / 100) * 6;

        pup[num].position.set(maxPupWidth, -2, (num * 100) - 1278);

        pup[num].scale.x *= 10;
        pup[num].scale.y *= 10;
        pup[num].scale.z *= 10;

        renderer.render(scene, camera);
    });
}

function missileinit(num, xaxis, zaxis) {
    let loader = new THREE.GLTFLoader();
    loader.load('missile/scene.gltf', function (gltf) {
        scene.add(gltf.scene);
        missile[num] = gltf.scene.children[0];

        missile[num].position.set(xaxis, 0, zaxis);

        missile[num].scale.y *= 0.25;

        renderer.render(scene, camera);
    });
}

function loop() {
    requestAnimationFrame(loop);

    for (i = 0; i < 10; i++) {
        for (j = 0; j < missilecount; j++) {
            if (missile[j])
                if (missile[j].position.z < -800)
                    continue;
            if (missile[j] && enemy[i]) {
                checkix = enemy[i].position.x;
                checkjx = missile[j].position.x;
                if ((checkjx < checkix + 5) && (checkjx > checkix - 5) && (missile[j].position.z == enemy[i].position.z + 5)) {
                    enemy[i].position.z -= 1000;
                    missile[j].position.z -= 1000;
                    score += 1;
                    document.getElementById("scorehere").innerHTML = score;
                }
            }
        }

        if (ship && enemy[i]) {
            checkjx = ship.position.x;
            checkix = enemy[i].position.x;
            if ((checkjx < checkix + 5) && (checkjx > checkix - 5) && (ship.position.z == enemy[i].position.z + 5)) {
                enemy[i].position.z -= 1000;
                health -= 10000;
                document.getElementById("healthhere").innerHTML = health;
            }
        }

        if (ship && pup[i]) {
            checkjx = ship.position.x;
            checkix = pup[i].position.x;
            if ((checkjx < checkix + 5) && (checkjx > checkix - 5) && (ship.position.z == pup[i].position.z + 5)) {
                pup[i].position.z -= 1000;
                health += 1000;
                document.getElementById("healthhere").innerHTML = health;
            }
        }
    }

    maxPlayerWidth = (window.innerWidth / 100) * 3;

    if (ship) {
        if (ship.position.z + zspeed < 1 && ship.position.z + zspeed > -60)
            ship.position.z += zspeed;
        if (ship.position.x + xspeed < maxPlayerWidth && ship.position.x + xspeed > -maxPlayerWidth)
            ship.position.x += xspeed;

        enemy.forEach(ship => {
            ship.position.z += 1;

            //add enspeed to x coord
            //if at edge, flip enspeed

            if (ship.position.x >= maxPlayerWidth || ship.position.x <= -maxPlayerWidth) {
                enspeed[enemy.indexOf(ship)] = -enspeed[enemy.indexOf(ship)]
                ship.position.x += enspeed[enemy.indexOf(ship)]
            }

            if (ship.position.x < maxPlayerWidth && ship.position.x > -maxPlayerWidth)
                ship.position.x += enspeed[enemy.indexOf(ship)]

            if (ship.position.z > 20) {
                ship.position.x = (Math.random() - 0.5) * (window.innerWidth / 100) * 6;
                ship.position.z = -1028;
            }
        });

        pup.forEach(ship => {
            ship.position.z += 1;
            if (ship.position.z > 20) {
                ship.position.x = (Math.random() - 0.5) * (window.innerWidth / 100) * 6;
                ship.position.z = -1028;
            }
        });
    }

    for (i = 0; i < missilecount; i++) {
        if (missile[i])
            if (missile[i].position.z < 1500)
                missile[i].position.z -= 3;
    }

    if (health <= 0) {
        document.getElementById("gameover").innerHTML = "GAME OVER";
        return;
    }

    renderer.render(scene, camera);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick(event) {
    if (ship) {
        const keyCode = event.which;
        if (keyCode == 87)
            zspeed = -1;
        else if (keyCode == 83)
            zspeed = 1;
        else if (keyCode == 65)
            xspeed = -1;
        else if (keyCode == 68)
            xspeed = 1;

        if (keyCode == 32) {
            missileinit(missilecount, ship.position.x, ship.position.z);
            missilecount++;
        }
    }
}

function onStop(event) {
    if (ship) {
        const keyCode = event.which;
        if (keyCode == 87)
            zspeed = 0;
        else if (keyCode == 83)
            zspeed = 0;
        else if (keyCode == 65)
            xspeed = 0;
        else if (keyCode == 68)
            xspeed = 0;
    }
}

window.addEventListener('resize', onResize, false);
document.addEventListener('keydown', onClick, false);
document.addEventListener('keyup', onStop, false);

envinit();
shipinit();
for (i = 0; i < 10; i++) {
    enemyinit(i);
    pupinit(i);
}
loop();