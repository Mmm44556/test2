const submit = document.querySelector('.create');
window.history.replaceState(null,null,`/json.html`)
let initialization = init();

initialization.then(async (r) => {
    await showCaseTree(r);
    let tree = [{ 'text': 'data', selectable: false, nodes: r, type: 'dir' }];
    // console.log(r)
    $('#tree').treeview({
        data: tree,
        showIcon: true,
        showCheckbox: true,
        selectable: true,
        expandIcon: 'bi bi-folder-plus',
        collapseIcon: 'bi bi-folder-minus',
        checkedIcon: 'bi bi-check-lg',
        showBorder: false,
        // showTags:true,
        // multiSelect:true,
        onNodeUnselected: async (e, n) => {
            $('#tree').treeview('uncheckAll', { silent: true });
            $('.delete').addClass('visually-hidden');
            $('.deleteFolder').addClass('visually-hidden');
            $('#filesTree').treeview('uncheckAll', { silent: true });
            $('#filesTree').treeview('deleteChildrenNode', 0);
            $('#filesTree').treeview('unselectNode', [0, { silent: true }]);
            const bread = document.querySelector('.dirCrumb');
            bread.innerHTML = `<li class="breadcrumb-item active fw-medium "aria-current="page">data</li>`
            let unselectedIni = await init();//取消選取時展示data所有根資料夾
            let select = $('#tree').treeview('getSelected', 0);
            if (select.length == 0) {
                unselectedIni.forEach(e => $('#filesTree').treeview('addNode', [0, { node: template(e) }]));

            } else {
                return
            }
            window.history.replaceState(null,null,`search?data/`)
            // $('#tree').treeview('collapseNode', [ n.nodeId, { silent: true, ignoreChildren: true } ]);
            // $('#tree').treeview('deleteChildrenNode', n.nodeId);
            // $('#tree').treeview('toggleNodeExpanded', [ n.nodeId, { silent: true } ]);
        },

        onNodeSelected: (e, n) => {
          
            //同時監聽zip檔案上傳，將路徑新增到頁面
            ZipButtion.addEventListener('change', (fileInput) => {

                let reader = new FileReader();
                // console.log(fileInput.target.files)
                reader.onload = (e) => {
                    let uploadPath = Array.from(breadPath.children);
                    uploadPath = pathProcess(uploadPath);
                    let pa = uploadPath.split('\\');
                    pa.pop();
                    JSZip.loadAsync(e.target.result).then(function (zip) {
                        let obj = Object.values(zip.files)
                        let dirName = obj[0].name;
                        let filtDirName = dirName.replace("/", "")
                        let len = ((pa.length) - 1);
                        //提示存放路徑位置
                        let existFilesPath = uploadPath.replaceAll('\\', ' > ');
                        let existFolderPath = pa.join(' > ');
                        if (n.text == pa[len]) {

                            let reg = /.txt$/;
                            let filesTree = $('#filesTree').treeview('getNode', 0);
                            let fn = (e) => e.dirName == filtDirName;
                            let sameNode = filesTree.nodes.some(fn);

                            //判斷zip是否為純檔案，return並會放到母目錄dir
                            if (!(reg.test(filtDirName))) {
                                //根據filesTree重複節點防止新增
                                if (!(sameNode)) {
                                    $('#tree').treeview('addNode', [n.nodeId, { node: { text: filtDirName, nodes: [], type: 'dir' } }]);
                                    $('#filesTree').treeview('addNode', [0, { node: { text: createFolderTem(filtDirName), nodes: [], type: 'dir', 'filename': filtDirName } }]);
                                } else {
                                    alert(`Folder存放目錄:${existFolderPath}`);
                                }
                            } else {

                                alert(`File存放路徑:${existFilesPath}`);
                            }



                        }


                    })


                }
                reader.readAsArrayBuffer(fileInput.target.files[0]);
            })
            //切換展示區節點-------------------
            if (n.type == 'empty') {
                $('#tree').treeview('deleteNode', n.nodeId);
            }
            // 把父子節點組成路徑回傳 
            if (!(n.parentId == undefined)) {
                let path = parentSearch(n.nodeId);
                let pathForCrumb = path.filter(e => e);
                //路徑麵包屑
                breadCrumb(pathForCrumb, n.text);
                path.push(n.text);
                let filePath = path.join('\\');
                if (n.type === 'dir' && n.parentId !== undefined) {
                    let res = getLayer(filePath);
                    // $('#filesTree').treeview('unselectNode', [ 0, { silent: true } ]);
                    //根據節點對檔案區節點進行切換
                    $('#filesTree').treeview('uncheckAll', { silent: true });
                    $('.delete').addClass('visually-hidden');
                    $('.deleteFolder').addClass('visually-hidden');
                    filesTreeShowUp(res, n)
                    
                    window.history.replaceState(null,null,`search?${filePath.replaceAll('\\','/')}`)
                    

                }
            }



            


        },


    })

    submit.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        const input = document.querySelector('.fileName');
        const customfolderName = input.value.trim();

        if (!(customfolderName === "")) {
            const breadPath = document.querySelector('.dirCrumb');
            let breadArr = [...breadPath.children];
            breadArr.forEach((e, index, arr) => { arr[index] = e.innerHTML });
            if (!((breadArr.length) == 1)) {
                breadArr.splice(2, breadArr.length)
            }
            let str = breadArr.join('\\');
            //判別資料夾節點是否重複，再創建資料夾以及資料庫
            let x = checkSameFolders(str);
            x.then((tree2) => {
                let sameName = (e) => e.text == customfolderName;
                if (!(tree2.some(sameName))) {
                    let LowerName = customfolderName.toLowerCase();
                    let newPath = str.concat('\\', LowerName);
                    let folders = createDir(newPath);


                    //把初始化空節點刪除
                    folders.then((r) => {
                        // console.log(r);
                        let clearEmpty = (e, index, arr) => {
                            if (e.type == 'empty') {
                                arr.splice(index, 1)
                                return 1
                            } else {
                                return 0
                            }
                        }
                        let result = tree[0].nodes.some(clearEmpty)
                        const bread = document.querySelector('.dirCrumb');
                        let filenameNode = $('#filesTree').treeview('getNode', 0)
                        let dataNode = $('#tree').treeview('getNode', 0);
                        const isNodeExist = (e) => e.text == breadArr[1];
                        let FindIndex = dataNode.nodes.findIndex(isNodeExist);


                        if (result) {
                            //初始化新增            
                            $('#tree').treeview('deleteChildrenNode', 0);
                            $('#filesTree').treeview('deleteChildrenNode', 0);
                            $('#tree').treeview('addNode', [0, { node: { text: LowerName, nodes: [], type: 'dir', } }]);
                            //判斷在當前目錄時才新增節點
                            if (bread.children.length == 1) { $('#filesTree').treeview('addNode', [0, { node: { text: createFolderTem(LowerName), nodes: [], type: 'dir', 'filename': LowerName, } }]); }
                            // console.log(dataNode,filenameNode)
                        } else {
                            //二級目錄創建
                            let currentFolder;
                            if (dataNode.nodes[FindIndex] == undefined) {
                                currentFolder = 0;
                            } else {
                                currentFolder = dataNode.nodes[FindIndex].nodeId;
                            }
                            $('#tree').treeview('addNode', [currentFolder, { node: { text: LowerName, nodes: [], type: 'dir' } }]);
                            if (bread.children.length == 1) {
                                //在data根目錄才新增節點

                                $('#filesTree').treeview('addNode', [0, { node: { text: createFolderTem(LowerName), nodes: [], type: 'dir', 'filename': LowerName } }]);
                            } else {
                                if (bread.children.length == 2) {
                                    //當前目錄下才新增節點
                                    $('#filesTree').treeview('addNode', [0, { node: { text: createFolderTem(LowerName), nodes: [], type: 'dir', 'filename': LowerName } }]);
                                }
                            }
                        }

                    })
                    

                    
                    //開啟上傳提示
                    let date = document.querySelector('.dateTime');
                    let foo =  document.querySelector('.done');
                    let currentTime = new Date();
                    date.innerHTML = currentTime.toLocaleDateString();
                    foo.innerHTML =`資料夾創建成功!    *名稱: ${customfolderName}`;
                    const toastLiveExample = document.getElementById('liveToast');
                    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                    input.value = "";
                    toastBootstrap.show();
                    
                } else {

                    alert('資料夾名稱重複!');
                    return
                }
            })


        } else {
            alert('自訂名稱不可為空');
            return;
        }

    })

})
const fileTree = document.getElementById('filesTree');
//把filesTree讀取動畫
function spinner(){
    fileTree.innerHTML+=` <div class="d-flex justify-content-center align-items-center spiner" style="height:inherit">
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>`;
}
function filesTreeShowUp(res, n) { 
    spinner();
    setTimeout(()=>{
        document.querySelector('.spiner').innerHTML="";
        res.then((res) => {    
            $('#filesTree').treeview('deleteChildrenNode', 0);
            if (n.nodes.length == 0 && res[0].type !== 0) {
    
                $('#filesTree').treeview('deleteChildrenNode', 0);
                res.forEach(element => {
                    if (element.type == 'dir') {
                    //處理dir
                        $('#tree').treeview('addNode', [n.nodeId, { node: element }]);
                    }
                    //處理file
                    $('#filesTree').treeview('addNode', [0, { node: template({...element}), 'filename': element.text, }]);
    
                });
    
                $('#tree').treeview('expandNode', [n.nodeId, { silent: true }]);
    
            } else {
    
    
                //重置節點並再新增
                if (res[0].type !== 0) {
                    $('#tree').treeview('deleteChildrenNode', n.nodeId);
                    res.forEach((e) => {
                        $('#tree').treeview('addNode', [n.nodeId, { node: e }]);
                        $('#filesTree').treeview('addNode', [0, { node: template({...e}), 'filename': e.text }]);
    
                    })
                }
                $('#tree').treeview('expandNode', [n.nodeId, { silent: true }]);
                
                return
    
    
            }
        })
    },100)
           

}


//新稱麵包屑路徑
function breadCrumb(path, n) {
    const bread = document.querySelector('.dirCrumb');
    path.push(n);
    const pathCrumb = (e,index,arr) => {
        if(index == ((arr.length)-2))return `<li class="breadcrumb-item active fw-medium "aria-current="page" id="back">${e}</li>`;
         return `<li class="breadcrumb-item active fw-medium "aria-current="page">${e}</li>`
    };
    let c = path.map(pathCrumb);
    // console.log(c)
    
    bread.innerHTML = c.join().replaceAll(',', '');
    return bread.innerText
}


//選到子節點後對父節點勾選
function parentSearch(node, arr = []) {
    let parentNode = $('#tree').treeview('getParent', node);
    $('#tree').treeview('checkNode', [parentNode.nodeId, { silent: true }]);
    arr.unshift(parentNode.text);

    if (parentNode.parentId == undefined) return arr;
    return parentSearch(parentNode.nodeId, arr);
}

async function createDir(value) {
    return new Promise((resolve, rej) => {
        const progress = document.getElementById('progress');
        const formData = new FormData()
        formData.append('folderName', value);
        try {
            const response = fetch('http://localhost/api/createFolders.php', {
                method: 'POST',
                body: formData
            }).then(res => {
                resolve(res.json());
            });
        } catch (error) {
            console.log(err);
        }
    })

}


async function getLayer(value) {
    return new Promise((resolve, rej) => {
        const formData = new FormData()
        formData.append('folderName', value);
        try {
            fetch('http://localhost/api/layer.php', {
                method: 'POST',
                body: formData
            }).then(res => {
                let x =res.clone();
                
                resolve(res.json());
                return x.json();
               
            }).then(r=>{ 
                // console.log(r);
                // let filesTree = document.getElementById('filesTree').firstChild.dataset.nodeid;
                // $('#filesTree').treeview('addNode', [filesTree, { node: template({...r}), 'filename': r.text, }]);
            })
        } catch (error) {
            console.log(err, '發生錯誤');
        }
    })

};

function init() {
    return new Promise((resolve, reject) => {

        try {
            const init = fetch('http://localhost/api/initial.php', {
                method: 'GET',
                headers: {
                    'Accept':'application/json;charset=utf-8',
                }
            })
                .then(res => {
                    resolve(res.json())
                })
        } catch (error) {
            reject(error);
        }
    });
}

function checkSameFolders(BreadCrumbPath) {
    return new Promise((resolve, reject) => {
        let path = new FormData()
        path.append('dir', BreadCrumbPath);
        try {
            const check = fetch('http://localhost/api/initial.php', {
                method: 'POST',
                body: path,
                
            })
                .then(res => {
                    resolve(res.json())
                })
        } catch (error) {
            reject(error);
        }
    });
}



//動態新增節點的模板
function template(Node) {
    let reg = new RegExp(Node.type);
    let match = (/file/i);

    Node.text = `<div class=" container-fluid text-left ">
            <div class="row ">
                <div class=" col-md-5 col-xs-8 col-sm-5">
                    ${match.test(reg) ? `<i class="bi bi-file-earmark-fill text-primary px-2 fs-4"></i>${Node.text}` : `<i class="bi bi-folder-fill text-warning  px-2 fs-4"></i>${Node.text}`}</div>
                <div class=" col-md-3 col-xs-2 col-sm-5">${Node.type == 'dir' ? `Folder` : 'File'}</div>
                <div class=" col-md-2 col-xs-1 col-sm-2">${Node.timeStamp || '---'}</div>
                <div class=" col-md-2 col-xs-1 col-sm-2">${Node.size != undefined ? `${Node.size}&thinsp;KB` : `---`}</div>
            </div>
        </div>`;
    return Node;
}

//創建資料夾模板
function createFolderTem(n) {
    let timeStamp = new Date(Date.now());
    //創建時間
    let dataValues = [
        timeStamp.getFullYear(),
        `${timeStamp.getMonth() + 1 < 10 ? `0${timeStamp.getMonth() + 1}` : `${timeStamp.getMonth() + 1}`}`,
        `${timeStamp.getDate()}`
    ];
    n = `<div class="container-fluid text-left ">
            <div class="row " style="font-size:20px">
                <div class=" col-md-5 col-xs-8 col-sm-5 "><i class="bi bi-folder-fill text-warning  px-2 fs-4"></i>${n}&thinsp;</div>
                <div class=" col-md-3 col-xs-2 col-sm-5 ">Folder&thinsp;</div>
                <div class=" col-md-2 col-xs-1 col-sm-2 ">${n.timeStamp || dataValues.join('-')}&thinsp;</div>
                <div class=" col-md-2 col-xs-1 col-sm-2 ">---&thinsp;</div>
            </div>
        </div>`;
    return n;
}

//初始化展示
async function showCaseTree(r = []) {
    let copyArr = structuredClone(r)
    copyArr.forEach((e) => {
        e.text = `<div class=" container-fluid text-left ">
            <div class="row " style="font-size:20px">
                <div class=" col-md-5 col-xs-8 col-sm-5">${e.type == 'dir' ? `<i class="bi bi-folder-fill text-warning px-2 fs-4"></i>${e.text}` : ``}</div>
                <div class=" col-md-3 col-xs-2 col-sm-5">${e.type == 'dir' ? `Folder` : e.type == 'empty' ? '' : 'File'}</div>
                <div class=" col-md-2 col-xs-1 col-sm-2">${e.timeStamp || '---'}</div>
                <div class=" col-md-2 col-xs-1 col-sm-2">---</div>
            </div>
        </div>`;
    })

    let files = [{
        text: `<div class="fileNode container-fluid text-left ">
            <div class="row" id="columeType">
                <div class=" col-md-5 col-xs-8 col-sm-5 px-3">Name</div>
                <div class=" col-md-3 col-xs-2 col-sm-5 px-3">type</div>
                <div class=" col-md-2 col-xs-1 col-sm-2 px-3">Last modified</div>
                <div class=" col-md-2 col-xs-1 col-sm-2 px-3">Size</div>
            </div>
        </div>`,
        nodes: copyArr,
        topNode: true,
    }];
    $('#filesTree').treeview({
        data: files,
        showexpandIcon: false,
        Indent: false,
        showIcon: false,
        showCheckbox: true,
        uncheckedIcon: 'bi bi-square ',
        checkedIcon: 'bi bi-check2-square ',
        onNodeSelected: (e, n) => {
            //dbclick event
            clickNode(e,n)
            
            // if (n.topNode == true && n.nodes!=null) {
            //     $('.deleteFolder').removeClass('visually-hidden')
            //     $('#filesTree').treeview('checkAll', { silent: true });
            //     let selectShowEdit =n.nodes.some(e=>e.type=='dir')
            //     if(!(selectShowEdit)){
            //     $('.delete').removeClass('visually-hidden')
            //     showEditedBtn(n)
            // };
            //     return
            // }

         



        },
        onNodeUnselected: (e, n) => {
            clickNode(e,n)
            if (n.topNode == true) {
                $('.delete').addClass('visually-hidden')
                $('.deleteFolder').addClass('visually-hidden')
            }

        },
        onNodeChecked: (e, n) => {
           
           
            showEditedBtn(n)

            
           





        },
        onNodeUnchecked: (e, n) => {

            if (n.topNode == true) $('#filesTree').treeview('uncheckAll', { silent: true });
            let unCheckedArr = $('#filesTree').treeview('getChecked', { silent: true });
            if (unCheckedArr.length == 0) {
                $('.delete').addClass('visually-hidden');
                $('.deleteFolder').addClass('visually-hidden');

            };

        }
    })
   
  

    

} 
//Double click event
    var lastSelectedNodeId = null;
    //最後一次觸發時間
    var lastSelectTime = null;

    //dbclick to Content
    function getIntoFolder(n){
        let dir = document.querySelector('.dirCrumb').innerText.split('\n');
        //判斷點的是DIR or FILE
        if(n.type == 'dir'){
            $('#filesTree').treeview('selectNode', [ n.nodeId, { silent: true } ]);
            let pathStr= breadCrumb(dir, n.filename).replaceAll('\n','/');
            $('#filesTree').treeview('deleteChildrenNode', 0);
          
            
            getLayer(pathStr).then(r=>{
                spinner();
                
                window.history.replaceState(null,null,`search?${pathStr}`);
                if(r[0].type!=0){
                setTimeout(()=>{
                    document.querySelector('.spiner').innerHTML="";
                    $('#filesTree').treeview('uncheckAll', { silent: true });
                    r.forEach(e=>{
                        $('#filesTree').treeview('addNode', [0, { node: template({...e}),'filename': e.text, }]);
                    })
                },500)
            }else{
                
                document.querySelector('.spiner').innerHTML="";
                $('#filesTree').treeview('uncheckAll', { silent: true });
                return
            }
                
            })
       
        }else{
            //點到file後查看轉譯內容
            let FilesnodeId =document.getElementById('filesTree').firstChild.firstChild.dataset.nodeid;
            let FilepathStr= breadCrumb(dir, n.filename).replaceAll('\n','/');
            $('#filesTree').treeview('deleteChildrenNode', Number(FilesnodeId));
            $('#CreatePlaceHolder').toggleClass('w-50');
            $('#leftColumn').removeClass('col-xxl-2').addClass('col-xxl-1');
            $('.fileZone').removeClass('col-xxl-10').addClass('col-xxl-11');
            
            $('.uploader').addClass('visually-hidden');
            
           
            window.history.replaceState(null,null,`search?${document.querySelector('.dirCrumb').innerText.replaceAll('\n','/')}`)
            
            setTimeout(()=>{
                document.getElementById('filesTree').firstChild.firstChild.style.visibility='hidden';
           
            document.querySelector('#filesTree .list-group').innerHTML+=
            `<nav class="w-75">
            <div class="nav nav-tabs " id="nav-tab" role="tablist">
              <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Input</button>
              <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Output</button>
            </div>
          </nav>
          
          <div class="tab-content w-75" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">...
            loplaceholder content the Home tab's associated content. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling. You can use it with tabs, pills, a
            placeholder content the Home tab's associated content. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classesis one for the next. The tab JavaScript swaps classes to control the content visibility and styling. You can use it with tabs, pills, a
            </div>
            <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">...
            loplaceholder content the Home tab's associated content. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling. You can use it with tabs, pills, a
            placeholder content the Home tab's associated content. Clicking anoth one for the next. The tab JavaScript swaps classes to control the content visibility and styling. Yo
            placeholder content the Home tab's associated content. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling. You can use it with tabs, pills, a
            </div>
           `;
      
    },500)
        }
        
        
        

    }
    //根據觸發selected、unseleted獲取時差，是同一個node就觸發
    function clickNode(event, n) {
    if (lastSelectedNodeId && lastSelectTime) {
    var time = new Date().getTime();
    var t = time - lastSelectTime;
    if (lastSelectedNodeId == n.nodeId && t < 300) {
        getIntoFolder(n);
    }
    }
    lastSelectedNodeId = n.nodeId;
    lastSelectTime = new Date().getTime();
    }

    document.querySelector('.dirCrumb').addEventListener('click',(e)=>{
        e.stopImmediatePropagation();
        // console.dir(e.target)
        if(e.target.id == "back"){
            if( document.querySelector('.dirCrumb').children.length==1)return;
           let BackPathStr = getBackPath(e.target);
           $('.uploader').removeClass('visually-hidden');
            getLayer(BackPathStr)
            .then(r=>{
                
                $('#filesTree').treeview('deleteChildrenNode', 0);
                //退回去時刪除最後一個節點
                

                
                document.querySelector('.dirCrumb').removeChild(document.querySelector('.dirCrumb').lastChild);
                //判斷前個節點是否null
                if( e.target.previousElementSibling!=null){
                   
                    e.target.id="";
                    e.target.previousElementSibling.id="back";
                }
                window.history.replaceState(null,null,`search?${BackPathStr}`)
                
                
                let filesTreeParentNode = document.querySelector('#filesTree .list-group').firstChild.dataset.nodeid;
                r.forEach(e=>{
                    $('#filesTree').treeview('addNode', [Number(filesTreeParentNode) , { node: template({...e}) ,'filename': e.text}]);
                })
            })
        }

    })
    //filesTree退回功能
    function getBackPath(node,arr=[]){
        if(node.previousElementSibling==null){
            arr.unshift(node.innerText);  
            return arr.join('/');
        }
        arr.unshift(node.innerText);
        return getBackPath(node.previousElementSibling,arr);
    }
//展示編輯按鈕
let fileBox = document.getElementById('nav-tabContent');
function showEditedBtn(n){
    
    if (n.topNode == true) $('#filesTree').treeview('checkAll', { silent: true });
    let CheckedArr = $('#filesTree').treeview('getChecked', { silent: true });
    let deleteBtn = document.querySelector('.uploadNavs .delete');
    //判斷是否有勾選文件
    if (CheckedArr.length >= 1) {
        let r = /.json$/i;
        let closeFolderNodeBtn = [...new Set(CheckedArr)];
        //如果節點都是資料夾類型，關閉編輯按鈕，開啟刪除按鈕
        closeFolderNodeBtn.forEach((e, index) => {
           
            if (r.test(e.filename)) {
                $('.delete').removeClass('visually-hidden')
                $('.deleteFolder').removeClass('visually-hidden')
            } else {
                $('.delete').addClass('visually-hidden')
                $('.deleteFolder').removeClass('visually-hidden')
            }
        })
        // 都為檔案時，監聽編輯按鈕
        let listFileInfo = document.querySelector('#editedModal .listFile');
        let fn = (e) => {
            e.stopImmediatePropagation();
            
            let regFileType = /.json$/i;
            let filesTreeChecked = [...document.querySelectorAll('#filesTree  .node-checked')];
            filesTreeChecked.forEach((e, index, arr) => {
                let fileName = e.outerText.split('\n');
                //判斷是否為json檔案，反之為資料夾
                if (regFileType.test(fileName[0])) {
                    arr[index] = { "text": fileName[0], "state": "checked", "type": "file" };

                } else if (!(fileName[0] == 'Name')) {
                    arr[index] = { "text": fileName[0], "state": "checked", "type": "dir" };
                } else {
                    arr[index] = { "text": fileName[0], "state": "checked", "type": "rootNode" };

                }
            });

            if(filesTreeChecked[0].text=='Name') filesTreeChecked.shift();
            
            filesTreeChecked.forEach(e=> {
                let listItem =
                    ` <a class="list-group-item " data-bs-toggle="list"role="tab" style="cursor:pointer">
                <i class="bi bi-file-earmark-fill text-primary px-2 fs-4 me-2"></i>${e.text}</a>`;
                listFileInfo.innerHTML+=listItem;
            })

        }
        const myModalAlternative = document.getElementById('editedModal')
        let getNavPath = document.querySelector('.dirCrumb');
        let editedPath = document.querySelector('.editedPath');
        let showFileContent = document.querySelector('.listFile');
        let showCurrentClick = document.querySelector('.currentFileName');
        deleteBtn.addEventListener('click', fn, false);
        //關閉編輯清除資料
        myModalAlternative.addEventListener('hidden.bs.modal', (e) =>{
            fileBox.innerHTML="";
            listFileInfo.innerHTML="";
            showCurrentClick.innerHTML="";
           
           
            window.history.replaceState(null,null,`search?${getNavPath.innerText.replaceAll('\n','/')}`)
            showFileContent.removeEventListener('click',showName);
            

        });
        //開啟編輯獲取路徑
        const showName =async (e)=>{
            
            fileBox.innerHTML="";
            e.stopImmediatePropagation();
            // 點選後展示當前檔案  
           
            
            showCurrentClick.innerHTML = e.target.innerText;
            let fileName = e.target.innerText;
            let editedPath = document.querySelector('.editedPath').innerText;
            let fileFullPath = editedPath.replaceAll('\n','/');
            const url = 'http://localhost/api/fileContent.php/?';
            
            //獲取該筆檔案url
            let OriginUrl = `http://localhost/api/fileContent.php/?&path=${fileFullPath}&name=${showCurrentClick.innerText}`
            let fileContent = await fetch(OriginUrl,{
                headers:{
                    'Accept':'application/json;charset=utf-8',
                }
            });
            fileBox.innerHTML= ` <div class="d-flex justify-content-center align-items-center" style="height:80vh">
            <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`
            
            let data = await fileContent.json();
            
            // console.log(data)
            setTimeout(()=>{
                fileBox.innerHTML="";
                data.forEach((e,index,ar)=>{
                    e.Sentences.forEach((e,index,arr)=>{
                        arr[index]=arr[index].trim();
                        arr[index]= `${e}\n`})
                    fileBox.innerHTML+= 
                    `<div class="card  mb-4" style="width:100%;">
                        <div class="card-header " style="font-Size:18px">Type: <span class="fs-5 border border-black fw-bold " id="keyType">${e.Type}</span></div>
                        <div class="card-body p-0 border">
                            <p class="card-text">
                                <textarea class="form-control " id="floatingTextarea" style="overflow-y: scroll;overscroll-behavior:contain; resize:vertical;height: 100px; font-size:20px">${e.Sentences.join('')}</textarea>
                            </p>
                        </div>`;
                        
                })
            },350)
           
            const save = document.getElementById('saveBtn');
            
            const routChange = getNavPath.innerText.replaceAll('\n','/');
            window.history.replaceState(null,null,`search?${routChange}/${fileName}`);
            //儲存按鈕
            save.addEventListener('click',(e)=>{
                e.stopImmediatePropagation();
                
                let typeArr = [...document.querySelectorAll('#keyType')];
                let modified = [...document.querySelectorAll('#floatingTextarea')];
                const reg = /^\s*$/;
                let contentArr = modified.map((e,index,arr)=>arr[index]=e.value);
                
                contentArr.forEach((e,index,arr)=>{        
                    let spli = e.split('\n');
                    arr[index]= spli.filter(e=>{if(!(reg.test(e))) return e;});    
                })

                if(typeArr.length>0){
                    //重新組裝編輯檔案
                    typeArr.forEach((e,index,arr)=>{arr[index] = {'Type':e.innerText,'Sentences':contentArr[index]} })
                     //判斷是否有重命名檔案url
                    let modifiedName = document.getElementById('floatingFileName').value;
                    let modifiedUrl = modifiedName == ''?`${url}&path=${fileFullPath}&name=${showCurrentClick.innerText}`:`${url}&path=${fileFullPath}&name=${showCurrentClick.innerText}&rename=${modifiedName}.json`
                    let reFile =  sentModifiedFile(typeArr,modifiedUrl);
                    // console.log(reFile)
                    


                   

                    reFile.then(r=>{
                        // console.log(r)
                        
                    }).finally( ()=>{
                        // listFileInfo.innerHTML="";
                    if(modifiedName!=""){
                    let updateList =getLayer(fileFullPath);
                    updateList.then(r=>{
                        
                        let listFileInfo = document.querySelector('#editedModal .listFile');
                        //更新檔案表LIST
                      let findModifiedIndex = r.findLastIndex(e=>e.text==`${modifiedName}.json`);
                    //   console.log(r,modifiedName,findModifiedIndex)
                        if(findModifiedIndex != -1){
                            let filesArr = $('#filesTree').treeview('getNode', 0);
                            let deleteReg = /active/i;
                            let deleteOldNode = [...document.getElementById('list-tab').children];
                            //找到更名前的節點index
                            let index = deleteOldNode.findLastIndex(e=>deleteReg.test(e.className));
                            let index2 = filesArr.nodes.findLastIndex(e=>e.filename == document.getElementById('list-tab').children[index].innerText );
                            let e = r[findModifiedIndex];
                            //同時更新編輯、檔案列表的節點
                            listFileInfo.innerHTML+=
                            ` <a class="list-group-item " data-bs-toggle="list"role="tab" style="cursor:pointer">
                        <i class="bi bi-file-earmark-fill text-primary px-2 fs-4 me-2"></i>${r[findModifiedIndex].text}</a>`;
                        $('#filesTree').treeview('addNode', [0, { node: template({...e}), 'filename': e.text }]);
                        $('#filesTree').treeview('deleteNode', filesArr.nodes[index2].nodeId);
                        document.getElementById('list-tab').removeChild(document.getElementById('list-tab').children[index]);


                        }
                       
            
                    });
                }
                    showCurrentClick.innerText = modifiedName == '' ? showCurrentClick.innerText : `${modifiedName}.json` ; 
                    document.getElementById('floatingFileName').value = "";
                    let footer = document.getElementById('moadlfooter');
                    footer.innerHTML= `
                        <div class="alert alert-success d-inline-flex justify-content-between" id="editedWork" role="alert" style="width: 500px; height: 50px;padding: 10px;">
                            <span class="fw-semibold"><i class="bi bi-check-circle-fill text-success  fs-5"></i>編輯成功!</span>
                            <span class="me-3 fw-semibold" style="font-size:15px;padding:5px; ">檔案位置: ${fileFullPath}</span>
                        </div>
                        <button type="button" class="btn btn-secondary"data-bs-dismiss="modal" id="clsModal"style="position: absolute;right: 40px;">Close</button>
                        `;
                            //提示fadeIn,fadeOut
                            const hint = document.getElementById('editedWork');
                            let timer = 100;
                            let reset = ()=>{timer=100;mouse=true};
                            let rmReset = ()=>{mouse=false;};
                            let mouse = false;
                            hint.addEventListener('mouseenter',reset)
                            let fadeId=setInterval(()=>{
                                timer-=5;
                                hint.style.opacity=timer/100;
                                if(mouse){
                                    timer=100;
                                    hint.addEventListener('mouseleave',rmReset);
                                }
                                if(hint.style.opacity==0){
                                    clearInterval(fadeId);
                                    hint.removeEventListener('mouseenter',reset);
                                    hint.removeEventListener('mouseleave',rmReset);
                                }
                            },200)

                    }
            );
                    //更新modal狀態
                 
                    
                    
                   
                }else{
                    return;
                }

                   
                })
        }

        //將當前路徑放到modal路徑
        const pathSet = (e)=>{
            
            editedPath.innerHTML = getNavPath.innerHTML;
            showFileContent.addEventListener('click',showName,false)
        }
        myModalAlternative.addEventListener('show.bs.modal',pathSet,false);

    };
}
//將修改後檔案送到後端
async function sentModifiedFile(typeArr,modifiedUrl){
    try {
        let result =await fetch(modifiedUrl,{
                method:'PUT',
                headers:{
                    'Accept':'application/json;charset=utf-8',
                    'Content-Type':'application/json;;charset=utf-8',
                },
                body:JSON.stringify(typeArr),
            })
            return result.text();
    } catch (error) {
        console.log(error);
    }
}

