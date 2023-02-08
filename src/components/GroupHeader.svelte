<script>
  export let group
</script>

<div class="header">
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
    color: grey;
  }
  .blue {
    color: blue;
  }
  .red {
    color: red;
  }
  .yellow {
    color: yellow;
  }
  .green {
    color: green;
  }
  .pink {
    color: pink;
  }
  .purple {
    color: purple;
  }
  .cyan {
    color: cyan;
  }
  .orange {
    color: orange;
  }
  .grey::placeholder {
    color: grey;
  }
  .blue::placeholder {
    color: blue;
  }
  .red::placeholder {
    color: red;
  }
  .yellow::placeholder {
    color: yellow;
  }
  .green::placeholder {
    color: green;
  }
  .pink::placeholder {
    color: pink;
  }
  .purple::placeholder {
    color: purple;
  }
  .cyan::placeholder {
    color: cyan;
  }
  .orange::placeholder {
    color: orange;
  }
</style>