//DATABASE
/*
Conexion
 */
    const config = {
        apiKey: "AIzaSyDzrlNuSRMeGYAqWvFS_3h53WeFsmMNxNg",
        authDomain: "pimdaki-e16a0.firebaseapp.com",
        databaseURL: "https://pimdaki-e16a0.firebaseio.com",
        projectId: "pimdaki-e16a0",
        storageBucket: "pimdaki-e16a0.appspot.com",
        messagingSenderId: "172646261705"
      };
     firebase.initializeApp(config)

$(document).on('ready', function() {
    $("#input-folder-2").fileinput({
        browseLabel: 'Selecciona imagenes...',
        previewFileType: "image",
        language: "es",
        showUpload: false,
        browseClass: "btn btn-success",
        browseLabel: "Agregar",
        browseIcon: "<i class=\"glyphicon glyphicon-picture\"></i> ",
        removeClass: "btn btn-danger",
        removeLabel: "Eliminar",
        removeIcon: "<i class=\"glyphicon glyphicon-trash\"></i> ",
        uploadClass: "btn btn-info",
        uploadLabel: "Cargar",
        uploadIcon: "<i class=\"glyphicon glyphicon-upload\"></i> "
    });
    // method chaining
    // $('#input-folder-2').fileinput('upload').fileinput('disable');
    var catalog =[];
    $('#input-folder-2').on('fileloaded', function(event, file, previewId, index, reader) {
        // Get a reference to the storage service, which is used to create references in your storage bucket
        var storage = firebase.storage();
        // Create a storage reference from our storage service
        var storageRef = storage.ref();
        //Create the file metadata
        var metadata = {
          contentType: 'image/jpeg'
        };
        //Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child($("#txt_productID").val()+'/' + file.name).put(file, metadata);
        //Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            //Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
          //A full list of error codes is available at
          //https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              //User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              //User canceled the upload
              break;
            case 'storage/unknown':
              //Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function() {
          // Upload completed successfully, now we can get the download URL
          var downloadURL = uploadTask.snapshot.downloadURL;
          cosole.log(downloadURL);
          catalog.push(downloadURL);
         
          
        });
      
    });

//---------------------- DASHBOARD ADMINISTRATOR LISTENER -------------------------------
    _onChangeStatusPage();
});



//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});

//ROUTES
/*ARTICULOS*/
    const ARTICULOS = "storage/products";
    const ARTICULOS_CATEGORIA=  ARTICULOS+"/categories";

/*PEDIDOS*/
    const PEDIDO = "storage/requests";
    const PEDIDO_ARTICULOS=  PEDIDO+"/categories";


;

//ADD NODES
const agregar = (ruta, obj)=>{
    firebase.database()
        .ref(ruta)
        .set({...obj})
        .then(()=>console.log("Realizado con exito!"))
        .catch((error)=>console.log("Error: "+error));
}
//UPDATE 
const actualizar=(ruta, dato)=>{
    firebase.database()
        .ref(ruta+'/')
        .set({dato})
        .then(()=>console.log("Realizado con exito!"))
        .catch((error)=>console.log("Error: "+error));
}
//DELETE
const borrar=(ruta)=>{
    alert(ruta);
}
//DISPLAY   
const mostrar=(ruta, detalle="")=>{
    firebase.database().ref(ruta+'/'+detalle).on('value', function(snapshot) {
        console.log(snapshot.val());
    }); 
}

//CONTROLLER METHODS

/*
    Listening page actions
 */function _onChangeStatusPage(){
       let materials = {};
       let category,subCategory,id,barCode,name,model,price,oldPrice,tradeMark,size,description;
       $('#dd_category').change(()=>{category=$('#dd_category').val()}); 
       $('#dd_subCategory').change(()=>{subCategory=$('#dd_subCategory').val()}); 
       $("#txt_productID").keyup(()=>{id=$("#txt_productID").val()});
       $("#txt_barCode").keyup(()=>{ barCode=$("#txt_barCode").val()});
       $("#txt_productName").keyup(()=>{ name=$("#txt_productName").val()});
       $("#txt_productModel").keyup(()=>{ model=$("#txt_productModel").val()});
       $("#txt_price").keyup(()=>{ price=$("#txt_price").val()});
       $("#txt_oldPrice").keyup(()=>{ oldPrice=$("#txt_oldPrice").val()});
       $("#txt_trademark").keyup(()=>{ tradeMark=$("#txt_trademark").val()});
       $("#txt_productSize").keyup(()=>{ size=$("#txt_productSize").val()});
       $("#ta_descripPro").keyup(()=>{ description=$("#ta_descripPro").val()});
       $('#dd_materials').change(function () {
          $( "#dd_materials option:selected" ).each(function(i) {
              materials[i]=$( this ).text();
          });
        })
        .change();

       let folder=null;
        $('#btn_reset').click(()=>alert("click"));
        $('#btn_push').click(()=> {_addProduct(category,subCategory,id,barCode,name,model,price,oldPrice,tradeMark,size,description,materials,folder)});
 

  }              
/*
    Listening page actions
 */function _addProduct(category,subCategory,id,barCode,name,model,price,oldPrice,tradeMark,size,description,materials,catalog){
        const product={
            category,
            subCategory,
            barCode,
            name,
            model,
            price,
            oldPrice,
            tradeMark,
            size,
            description,
            materials,
            catalog
        };
       let route = ARTICULOS_CATEGORIA+"/"+product.category+"/"+product.subCategory+"/"+id+"/";
      console.log(route);
       console.log(product);
      agregar(route,product)
       
    }



