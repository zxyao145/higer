import { For, createSignal } from "solid-js";
import "./SearchSelect.css";
import languages from "./languages";

interface Option {
  value: string;
  text: string;
  selected?: boolean;
}

interface SearchSelectProps {
  onClick: (v: Option) => void;
}

function SearchSelect(props: SearchSelectProps) {
  const [getSearchText, setSearchText] = createSignal("");

  const options: Array<Option> = languages.list.map((x) => {
    return { text: x, value: x, selected: false };
  });
  let selectedOption = options[0];

  const [getSelected, setSelected] = createSignal(selectedOption);

  return (
    <div class="search-select">
      <div class="dropdown">
        <button
          class="btn btn-default dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {getSelected().value}
        </button>
        <div class="dropdown-menu" role="menu">
          <input
            type="search"
            class="form-control"
            autocomplete="off"
            onInput={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <ul class="list-group">
            <For
              each={options.filter(
                (x) => x.value.indexOf(getSearchText()) > -1
              )}
              fallback={<li>Loading...</li>}
            >
              {(item) => (
                <li
                  class={`list-group-item list-group-item-action ${
                    getSelected().value === item.value ? "active" : false
                  }`}
                  onClick={() => {
                    if (props.onClick) {
                      props.onClick(item);
                    }
                    setSelected(item);
                  }}
                >
                  {item.text}
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SearchSelect;
