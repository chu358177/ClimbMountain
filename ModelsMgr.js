

function ModelsMgr() {
    //member variable
    this.loader = null;
    this.fbxTree = null;
    this.fbxGround = null;
    var mTimeCount = 0;
    var mDurationTime = 2;
    var mPosArray = new Array(new THREE.Vector3(0, -2, 3),
        new THREE.Vector3(0, -1, 2),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, -2),
        new THREE.Vector3(0, 2, -4),
        new THREE.Vector3(0, 3, -6));

    ModelsMgr.prototype.GroupList = new Array();

// member function
    ModelsMgr.prototype.LoadFbx = function () {

        console.log("LoadFbx");
        ModelsMgr.loader = new THREE.FBXLoader();
        ModelsMgr.loader.onLoad = function () {
            console.log('Loading complete!');
        };
        //Load Ground
        ModelsMgr.loader.load('ClimbModels/ground.fbx', function (object) {
            object.position.set(0, 0, 0);
            object.scale.multiplyScalar(0.1);
            console.log(object.children[0].name + "  " + object.scale.x);

            object.traverse(function (child) {

                if (child.isObject3D) {
                    var box = new THREE.Box3().setFromObject(child);

                    var helper = new THREE.Box3Helper(box, 0xffff00);
                    scene.add(helper);

                    //console.log(box.getSize());
                    var groundShape = new Ammo.btBoxShape(box.getSize() * 0.5);
                    //createRigidBody(child,groundShape,0,pos,quat);
                }
            });
            //console.log("pos:" + object.position.x);
            this.fbxGround = object;
        }, (ev) => {
            console.log(ev);
        }, (e) => {
            console.log(e);
        });
        //ModelsMgr.loader.onloadend.
        //load Tree
        ModelsMgr.loader.load('ClimbModels/tree.fbx', function (object) {
            object.position.set(0, 0.3, 0);

            object.scale.multiplyScalar(0.1);
            console.log(object.children[0].name + "  " + object.scale.x);

            object.traverse(function (child) {

                if (child.isObject3D) {
                    var box = new THREE.Box3().setFromObject(child);

                    //console.log( box.getSize() );
                    var groundShape = new Ammo.btBoxShape(box.getSize() * 0.5);
                    //createRigidBody(child,groundShape,0,pos,quat);

                    //child.material = new THREE.MeshBasicMaterial();
                }
            }, (ev) => {
                console.log(ev);
            }, (e) => {
                console.log(e);
            });
            //console.log("pos:" + object.position.x);

            this.fbxTree = object;

            ModelsMgr.prototype.Init();
        });
    }

    // add single Ground
    function AddGround() {
        var cp = fbxGround.clone();
        return cp;
    }

    function AddTree(pos) {
        var cp = fbxTree.clone();
        cp.position.copy(pos);
        return cp;
    }

    ModelsMgr.prototype.AddGroundTree = function (groupPos, groupName) {
        var group = new THREE.Group();
        group.name = "group_" + groupName;

        var treeNum = Math.floor(Math.random() * 3) + 2;
        var treeArrayPos = RandomNumArray(treeNum,-2,2);
        console.log(group.name + " treeNum: " + treeNum);
        console.log(group.name + " treeArrayPos: " + treeArrayPos);
        for (var i = 0; i < treeNum; i++) {
            var treePos = treeArrayPos[i];
            console.log("treePos: " + treePos);
            var treeTemp = AddTree(new THREE.Vector3(treePos, 0.3, 0));
            group.add(treeTemp);
        }

        var groundTemp = AddGround();
        group.add(groundTemp);
        group.position.copy(groupPos);
        this.GroupList.push(group);
        scene.add(group);
    }

    ModelsMgr.prototype.Init = function () {
        //
        ModelsMgr.prototype.AddGroundTree(mPosArray[1], 1);
        ModelsMgr.prototype.AddGroundTree(mPosArray[2], 2);
        ModelsMgr.prototype.AddGroundTree(mPosArray[3], 3);
        ModelsMgr.prototype.AddGroundTree(mPosArray[4], 4);
        ModelsMgr.prototype.AddGroundTree(mPosArray[5], 5);


    }

    ModelsMgr.prototype.Update = function (delta) {
        if (this.GroupList.length != 5) return;
        mTimeCount += delta;
        //var x = THREE.Vector.lerp(new THREE.Vector3(0,0,0),new THREE.Vector3(0,-1,-2),0.5);
        //console.log("mTimeCount: " + mTimeCount);
        var moveTime = mTimeCount / mDurationTime;
        //console.log("moveTime: " + moveTime);
        if (moveTime > 1.0) {
            RandomTree(this.GroupList[0]);
            addNewTree(this.GroupList[0]);
            this.GroupList[0].position.copy(mPosArray[5]);
            mTimeCount = 0;
            var first = this.GroupList.shift();
            this.GroupList.push(first);
        } else {
            this.GroupList[0].position.lerpVectors(mPosArray[1], mPosArray[0], THREE.Math.clamp(moveTime, 0, 1));
            this.GroupList[1].position.lerpVectors(mPosArray[2], mPosArray[1], THREE.Math.clamp(moveTime, 0, 1));
            this.GroupList[2].position.lerpVectors(mPosArray[3], mPosArray[2], THREE.Math.clamp(moveTime, 0, 1));
            this.GroupList[3].position.lerpVectors(mPosArray[4], mPosArray[3], THREE.Math.clamp(moveTime, 0, 1));
            this.GroupList[4].position.lerpVectors(mPosArray[5], mPosArray[4], THREE.Math.clamp(moveTime, 0, 1));
        }
    }

    function addNewTree(group) {
        var treeNum = Math.floor(Math.random() * 3) + 2;
        var treeArrayPos = RandomNumArray(treeNum,-2,2);
        console.log(group.name + " treeNum: " + treeNum);
        console.log(group.name + " treeArrayPos: " + treeArrayPos);
        for (var i = 0; i < treeNum; i++) {
            var treePos = treeArrayPos[i];
            console.log("treePos: " + treePos);
            var treeTemp = AddTree(new THREE.Vector3(treePos, 0.3, 0));
            group.add(treeTemp);
        }
    }

    function RandomTree(group) {
        // console.log("group: " + group.name + "   length: " +group.children.length);
        var lengthChild = group.children.length;
        for (var i = 0; i <= lengthChild; i++) {
            var tree = group.getObjectByName("TreeGroup");
            if (tree) {
                group.remove(tree);
            }
            // console.log("RandomTree: "+group.children[i].name);
            // if(group.children[i].name === "TreeGroup")
            //     {
            //         group.remove(group.children[i]);
            //     }
        }
        // group.traverseVisible(function (child) {
        //     console.log("RandomTree: "+child.name);
        //     if(child.name === "TreeGroup")
        //     {
        //         console.log("remove: "+child.name);
        //
        //         group.remove(child);
        //     }
        // })
    }

    function RandomNumArray(count,minVal,maxVal) {
        let arr = [];
        let i = 0;
        if (!isNaN(count)) {
            while (i < Math.floor(count)) {
                let number = Math.floor((Math.random() * (maxVal - minVal) + minVal));
                if (arr.indexOf(number) < 0) {
                    arr.push(number);
                    i++;
                }
            }

            return arr;
        }
    }
}
