import {Provider} from 'react-redux';
import store from './store'
import './App.css';
import Skills from './components/Skills';

function App() {
  return (
    <Provider store={store}>
    <Skills />
    </Provider>
  );
}

export default App;