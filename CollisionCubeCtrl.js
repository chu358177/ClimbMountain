
function CollisionCubeCtrl(OnCollision) {
    var cubeList = new List();
    //this.OnCollision = null;


    var box3Player = new THREE.Box3();
    var box3Temp = new THREE.Box3();

    CollisionCubeCtrl.prototype.Update = function (playerCube) {
      //  console.log("Collision cubeList.length: " + cubeList.length());
        var length = cubeList.length();
        if(length == 0 ) return;
        for (var i= 0;i<length;i++)
        {
            //Box3()
            var bb = cubeList.dataSouce[i];
            box3Temp.setFromObject(bb);
            box3Player.setFromObject(playerCube);

            var isCollision = box3Temp.intersectsBox(box3Player);
            if (isCollision)
            {
                if(OnCollision) OnCollision();
                console.log("Collision CCCCCCCCCCCCCCCCCCCCC");

            }
        }
    }

    //items
    CollisionCubeCtrl.prototype.AddCube = function (item) {
        //for (var i= 0;i<items.length;i++)
        {
            cubeList.append(item);
        }
    }

    CollisionCubeCtrl.prototype.RemoveCube = function (item) {
        //for (var i= 0;i<items.length;i++)
        {
            cubeList.remove(item);
        }
    }

    CollisionCubeCtrl.prototype.Clear =function () {
        cubeList.clear();
    }
}
