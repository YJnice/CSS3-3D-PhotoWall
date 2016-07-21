(function () {
    var ROW = 4, // 图片阵列行数
        COL = 6, // 图片阵列列数
        NUM = ROW * COL, //图片阵列总数
        BIG_IMG_WIDTH = 750, //大图片宽度
        BIG_IMG_HEIGHT = 500,//大图片高度
        THUMB_IMG_WIDTH = THUMB_IMG_HEIGHT = 125;//缩略图宽度与高度
    // 预加载图片，包括大图和缩略图
    var iLoaded = 0; // 用来记录是否所有图片已加载完毕
    for (var i = 1; i <= NUM; i++) {
        var oBigImg = new Image();
        oBigImg.src = 'img/' + i + '.jpg';
        oBigImg.onload = function () {
            if (++iLoaded == NUM * 2) {
                loadSuccess();
            }
        };

        var oThumbImg = new Image();
        oThumbImg.src = 'img/thumbs/' + i + '.jpg';
        oThumbImg.onload = function () {
            if (++iLoaded == NUM * 2) {
                loadSuccess();
            }
        };
    }
    // 图片全部加载完毕后执行，
    function loadSuccess() {
        var oContainer = document.getElementById('container');
        var oPrev = document.getElementById('prev');
        var oNext = document.getElementById('next');
        var iColGap = (oContainer.offsetWidth - COL * THUMB_IMG_WIDTH) / (COL + 1),//横向图片间隙
            iRowGap = (oContainer.offsetHeight - ROW * THUMB_IMG_HEIGHT) / (ROW + 1);//纵向图片间隙
        var bReady = false;//用来标识是否所有的图片格子准备就绪，没就绪不允许点击
        var bClicked = false;//用来标识某一个图片格子是否被点击
        var iNow = -1; //用来标识当前显示大图的索引，点击next和prev时使用
        //创建图片格子，一个格子一个div
        var index = 0; //图片格子的索引，从1开始
        for (var i = 0; i < ROW; i++) {
            for (var j = 0; j < COL; j++) {
                var oDiv = document.createElement('div');
                oDiv.pos = {
                    left: parseInt(iColGap + j * (THUMB_IMG_WIDTH + iColGap)),// 图片格子应该定位的位置
                    top: parseInt(iRowGap + i * (THUMB_IMG_WIDTH + iRowGap))
                };
                oDiv.index = index;
                oDiv.matrix = {
                    col: j,
                    row: i
                };
                oDiv.className = 'img';
                // 初始时所有格子都显示在屏幕左侧外面，然后一个一个滑动进入屏幕
                oDiv.style.left = -Math.random() * 300 - 200 + 'px';
                oDiv.style.top = -Math.random() * 300 - 200 + 'px';
                oDiv.style.width = THUMB_IMG_WIDTH + 'px';
                oDiv.style.height = THUMB_IMG_HEIGHT + 'px';
                oDiv.style.background = 'url(img/thumbs/' + (index + 1) + '.jpg)';
                oDiv.innerHTML = '<span></span>';
                oContainer.appendChild(oDiv);
                index++;
            }
        }
        var aImg = document.getElementsByClassName('img');
        index--;//循环后索引值多一个，所以先减1
        var timer = setInterval(function () {
            aImg[index].style.left = aImg[index].pos.left + 'px';
            aImg[index].style.top = aImg[index].pos.top + 'px';
            setStyle3(aImg[index], 'transform', 'rotate(' + (Math.random() * 40 - 20) + 'deg)');
            aImg[index].onclick = function () {
                if (!bReady)return;
                var me = this;
                if (bClicked) {//如果格子被点击过，则要重新打散
                    for (var i = 0; i < aImg.length; i++) {
                        var oSpan = aImg[i].getElementsByTagName('span')[0];
                        setStyle3(aImg[i], 'transform', 'rotate(' + (Math.random() * 40 - 20) + 'deg)');
                        aImg[i].style.left = aImg[i].pos.left + 'px';
                        aImg[i].style.top = aImg[i].pos.top + 'px';
                        oSpan.style.filter = 'alpha(opacity:0)';
                        oSpan.style.opacity = 0;

                        aImg[i].className = 'img';
                    }
                } else {//如果没有被点击过，则要显示大图片
                    iNow = me.index;
                    var bigImgPos = {//大图的位置应该在container的正中间
                        left: (oContainer.offsetWidth - BIG_IMG_WIDTH) / 2,
                        top: (oContainer.offsetHeight - BIG_IMG_HEIGHT) / 2
                    };
                    for (var i = 0; i < aImg.length; i++) {
                        var oSpan = aImg[i].getElementsByTagName('span')[0];
                        oSpan.style.background = 'url(img/' + (me.index + 1) + '.jpg) ' + -aImg[i].matrix.col * THUMB_IMG_WIDTH + 'px ' + -aImg[i].matrix.row * THUMB_IMG_HEIGHT + 'px';//该格子在大图中的位置应该是格子在整个格子矩阵中的列数和行数乘以对应的格子的宽与高
                        setStyle3(aImg[i], 'transform', 'rotate(0)');//格子的角度需要回正
                        aImg[i].style.left = bigImgPos.left + aImg[i].matrix.col * (THUMB_IMG_WIDTH + 1) + 'px';//格子的位置应该是大图左边的位置加上每个格子的宽度
                        aImg[i].style.top = bigImgPos.top + aImg[i].matrix.row * (THUMB_IMG_HEIGHT + 1) + 'px';
                        oSpan.style.filter = 'alpha(opacity:100)';
                        oSpan.style.opacity = 1;

                        aImg[i].className = 'img piece';
                    }
                    oPrev.style.display = oNext.style.display = 'block';
                }
                bClicked = !bClicked;
            };
            index--;
            if (index == -1) {
                clearInterval(timer);
                bReady = true;
            }

        }, 100);
        oPrev.onclick = oNext.onclick = function () {
            if (this == oPrev) {
                iNow--;
                if (iNow == -1) {
                    iNow = NUM - 1;
                }
            }
            else {
                iNow++;
                if (iNow == NUM) {
                    iNow = 0;
                }
            }
            var arr = [];
            for (i = 0; i < NUM; i++) {
                arr[i] = i;
            }
            arr.sort(function () {
                return Math.random();//打乱数组顺序
            });
            var timer = setInterval(function () {
                var item = arr.pop();
                aImg[item].getElementsByTagName('span')[0].style.background = 'url(img/' + (iNow + 1) + '.jpg) ' + -aImg[item].matrix.col * THUMB_IMG_WIDTH + 'px ' + -aImg[item].matrix.row * THUMB_IMG_HEIGHT + 'px';
                if (!arr.length)clearInterval(timer);
            }, 20);
        };
    }
})();