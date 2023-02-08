<script>
  export let group
</script>

<div>
  <input type="text" placeholder="{group.title}" class="{group.color}" readonly>
</div>

<style>
  div {
    grid-column: span 2;
  }
  input {
    border: none;
    padding: .125rem;
    padding-left: .625rem;
    margin-left: 1.5rem;
    margin-bottom: 0;
    background: hsl(206, 29%, 11%);
    font-size: 1rem;
    font-weight: bold;
    font-style: italic;
    color: rgb(26, 179, 230);
    max-width: 20rem;
  }
  input::placeholder {
    color: rgb(26, 179, 230);
  }
  input:focus {
    box-shadow: none;
  }
  .grey {
    color: #DADCE0;
  }
  .blue {
    color: #7CB7F5;
  }
  .red {
    color: #F48984;
  }
  .yellow {
    color: #F8D36E;
  }
  .green {
    color: #77C897;
  }
  .pink {
    color: #F68BCA;
  }
  .purple {
    color: #C68FF5;
  }
  .cyan {
    color: #5DDAEB;
  }
  .orange {
    color: #F6AA76;
  }
  .grey::placeholder {
    color: #DADCE0;
  }
  .blue::placeholder {
    color: #7CB7F5;
  }
  .red::placeholder {
    color: #F48984;
  }
  .yellow::placeholder {
    color: #F8D36E;
  }
  .green::placeholder {
    color: #77C897;
  }
  .pink::placeholder {
    color: #F68BCA;
  }
  .purple::placeholder {
    color: #C68FF5;
  }
  .cyan::placeholder {
    color: #5DDAEB;
  }
  .orange::placeholder {
    color: #F6AA76;
  }
</style>