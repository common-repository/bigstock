
<script type="text/html" id="tmpl-bsp-title-bar">
  <style rel='stylesheet' type='text/css'>
    .bsp-images-title {
      height: 40px;
      margin-top: 5px;
      margin-left: 10px;
      width: auto;
    }

    @media screen and (max-width: 420px) {
      .bsp-title-bar {
        overflow: hidden;
        max-height: 50px;
      }
      
      .bsp-images-title {
        margin-top: 0;
      }
    }

    #bsp-wp {
      height: 100%;
      width: 100%;
      font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif;
    }

    .bsp-support-links {
      float: right;
      list-style: none;
      margin-right: 55px;
      margin-top: 17px;
    }

    .bsp-support-links li {
      display: inline-block;
      margin: 0 5px;
    }

  </style>
  <img src="<?php echo plugins_url('img/bigstock-black.jpg',  __FILE__); ?>" class="bsp-images-title" alt="Bigstock"/>
  <ul class="bsp-support-links">
    <li><a class="bsp-contact" target="_blank" href='http://www.bigstockphoto.com/contactus.html'>Support/Contact Us</a></li>
    <li><a class="bsp-privacy" target="_blank" href='http://www.bigstockphoto.com/privacy.html'>Privacy Policy</a></li>
    <li><a class="bsp-account" target="_blank" href='http://www.bigstockphoto.com/account/'>Account Details</a></li>
  </ul>
</script>

<script type="text/html" id="tmpl-bsp-toolbar">
  <style>
    #IntercomBigstock {
      color: #1981df;
      float: right;
      text-decoration: none;
      display: none;
    }
    #IntercomBigstock #bsp-feedback {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      text-align: center;
      vertical-align: middle;
      margin: 5px 10px 5px 5px;
      display: inline-block;
      box-shadow: 1px 2px 1px 2px rgba(0, 0, 0, 0.1);
      position: relative;
      opacity: 1.0;
      transition: opacity .25s ease-in-out;
      -moz-transition: opacity .25s ease-in-out;
      -webkit-transition: opacity .25s ease-in-out;
      background-color: #1981df;
    }
    #IntercomBigstock #bsp-feedback:hover {
      cursor: pointer;
      opacity: 0.8;
    }
    #IntercomBigstock #bsp-feedback i {
      display: inline-block;
      color: #FFF;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  </style>
  <a id="IntercomBigstock" onClick="Intercom('show')" href="#">
    Questions or feedback? <span id="bsp-feedback"><i class="material-icons">chat</i></span>
  </a>
</script>
