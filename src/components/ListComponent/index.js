import { useState } from "react";
import "./index.scss";
import { createBrowserHistory } from "history";
import { v4 as uuidv4 } from "uuid";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";

const parseHashString = (str) => {
  if (str.startsWith("#tags=") && str.length > 6) {
    return str.slice(6).split(",");
  }
  return [];
};
function ListComponent() {
  const history = createBrowserHistory();

  const initialTags = parseHashString(history.location.hash);
  const [tags, setTags] = useState(initialTags);
  const [inputText, setInputText] = useState("");

  history.listen((location) => {
    setTags(parseHashString(location.hash));
  });

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  const handleButtonClick = () => {
    console.log(tags);
    if (inputText !== "") {
      const hash = history.location.hash;
      window.location.replace(hash + "," + inputText);
      setInputText("");
    }
  };
  const handleRemoveListItem = (name) => {
    // Assuming tags have individual names
    // If there are more than one tag with same name, first one will be removed
    const hash = history.location.hash;
    const newHash =
      hash.indexOf(name) === 6
        ? hash.replace(`${name}`, "").replace(",", "")
        : hash.replace(`,${name}`, "");
    window.location.replace(newHash);
  };

  return (
    <div className="container">
      <List>
        {tags.map((t) => (
          <ListItem key={uuidv4()}>
            <ListItemText primary={t} />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => {
                handleRemoveListItem(t);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
        {tags.length === 0 ? (
          <>
            <li>Seems like there's something wrong with the URL</li>
            <li>Example form: "#tags=red,blue,purple"</li>
          </>
        ) : null}
      </List>
      {tags.length !== 0 ? (
        <div className="add-wrapper">
          <Input type="text" onChange={handleInputChange} value={inputText} />
          <Button variant="contained" onClick={handleButtonClick}>
            Add the tag
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default ListComponent;
