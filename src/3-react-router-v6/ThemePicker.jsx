export function ThemePicker() {
  const handleThemeChange = (event) => {
    console.log(event.target.value);
    const theme = event.target.value;
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <label>
      Theme:
      <select
        name="themePicker"
        defaultValue="system"
        onChange={handleThemeChange}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
