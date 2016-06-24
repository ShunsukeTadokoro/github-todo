$(function() {

  function initialize() {
    switchScene('list');
    listenEvent();
    fetchTodos();
  }

  function backToList() {
    fetchTodos();
    $('#addTodoBtn').text('Add TODO');
    $('#preview').attr('src', 'http://placehold.it/400x300');
    $('#addTodoTitle').val('');
    switchScene('list');
  }

  function addTodo() {
    $('#addTodoBtn').text('Please wait...');
    axios({
      method: 'post',
      url: 'https://api.github.com/repos/ShunsukeTadokoro/todos/issues',
      headers: {
        'Authorization': 'token e9533d77cf347e98c22ccd474ffcb19054f76e50'},
      data: {
        title: $('#addTodoTitle').val(),
        body: $('#preview').attr('src')
      }
    }).then(function(res) {
      showDetail(res.data.url);
    });
  }

  function todoDone(id) {
    axios({
      method: 'patch',
      url: 'https://api.github.com/repos/ShunsukeTadokoro/todos/issues/' + id,
      headers: {
        'Authorization': 'token e9533d77cf347e98c22ccd474ffcb19054f76e50'},
      data: {
        state: 'closed'
      }
    }).then(function(res) {
      backToList();
    });
  }

  function fetchTodos() {
    $('#todos li').remove();
    axios.get('http://api.github.com/repos/ShunsukeTadokoro/todos/issues').then(function(res) {
      $.each(res.data, function(index, row) {
         $('<li><a href="' + row.url  +'" class="todoDetailLink">' + row.title +'</a></li>').appendTo('#todos');
      });
    });
  }

  function showDetail(href) {
    axios.get(href).then(function(res) {
      $('#detailTitle').text(res.data.title);
      $('#detailPreview').attr('src', res.data.body);
      $('#addTodoBtn').data('todo-id', res.data.number);
      $('#detailDone').data('todo-id', res.data.number);
      switchScene('detail');
    });
  }

  function listenEvent() {
    $(document).on('click', '.todoDetailLink', function(e) {
      e.preventDefault();
      showDetail(e.target.href);
    });

    $('#detailBack').on('click', function(e) {
      e.preventDefault();
      backToList();
    });

    $('#addTodoBtn').on('click', function(e){
      e.preventDefault();
      addTodo();
    });

    $('#detailDone').on('click', function(e){
      e.preventDefault();
      todoDone($(e.target).data('todo-id'));
    });

    $('#addTodoBody').on('change', function(e){
      previewFile(e);
    });
  }

  function switchScene(sceneId) {
    $('.scene').hide();
    $('#' + sceneId).show();
  }

  function previewFile() {
    var preview = document.getElementById('preview');
    var file    = document.getElementById('addTodoBody').files[0];
    var reader  = new FileReader();

    reader.onloadend = function () {
      preview.src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = 'http://placehold.it/400x300';
    }
  }

  initialize();
});