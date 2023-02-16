<script>
  export let group
</script>

<div>
  <input type="text" placeholder={group.title} class={group.color} readonly />
</div>

<style>
  div {
    grid-column: span 2;
  }
  input {
    border: none;
    padding: 0.125rem;
    padding-left: 0.625rem;
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
    color: #dadce0;
  }
  .blue {
    color: #7cb7f5;
  }
  .red {
    color: #f48984;
  }
  .yellow {
    color: #f8d36e;
  }
  .green {
    color: #77c897;
  }
  .pink {
    color: #f68bca;
  }
  .purple {
    color: #c68ff5;
  }
  .cyan {
    color: #5ddaeb;
  }
  .orange {
    color: #f6aa76;
  }
  .grey::placeholder {
    color: #dadce0;
  }
  .blue::placeholder {
    color: #7cb7f5;
  }
  .red::placeholder {
    color: #f48984;
  }
  .yellow::placeholder {
    color: #f8d36e;
  }
  .green::placeholder {
    color: #77c897;
  }
  .pink::placeholder {
    color: #f68bca;
  }
  .purple::placeholder {
    color: #c68ff5;
  }
  .cyan::placeholder {
    color: #5ddaeb;
  }
  .orange::placeholder {
    color: #f6aa76;
  }
</style>
