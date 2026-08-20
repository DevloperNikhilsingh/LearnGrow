const courseTests = {
  'figma-ui-ux-bootcamp': {
    courseId: '4',
    title: 'Figma UI/UX Bootcamp — Final Assessment',
    passingScore: 70,
    durationMinutes: 15,
    questions: [
      {
        id: 'q1',
        question: 'What does the useEffect hook let you do in a functional component?',
        options: [
          { id: 'a', text: 'Directly mutate the DOM without React' },
          { id: 'b', text: 'Run side effects after render, like data fetching' },
          { id: 'c', text: 'Define a new component class' },
          { id: 'd', text: 'Style a component with CSS modules' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q2',
        question: 'Which hook is used to manage local state in a functional component?',
        options: [
          { id: 'a', text: 'useState' },
          { id: 'b', text: 'useRef' },
          { id: 'c', text: 'useContext' },
          { id: 'd', text: 'useMemo' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'q3',
        question: 'What is the correct way to pass data from a parent to a child component?',
        options: [
          { id: 'a', text: 'Using global variables' },
          { id: 'b', text: 'Using props' },
          { id: 'c', text: 'Using localStorage' },
          { id: 'd', text: 'Using window.postMessage' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q4',
        question: 'What does the "key" prop help React do when rendering a list?',
        options: [
          { id: 'a', text: 'Style each list item differently' },
          { id: 'b', text: 'Identify which items changed, were added, or removed' },
          { id: 'c', text: 'Sort the list automatically' },
          { id: 'd', text: 'Limit the number of items rendered' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q5',
        question: 'Which statement about the React virtual DOM is correct?',
        options: [
          { id: 'a', text: 'It replaces the real DOM entirely, permanently' },
          { id: 'b', text: 'It is a lightweight copy used to compute the minimal set of real DOM updates' },
          { id: 'c', text: 'It only works with class components' },
          { id: 'd', text: 'It is a browser API' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q6',
        question: 'What is a controlled component in React?',
        options: [
          { id: 'a', text: 'A component whose form data is handled by React state' },
          { id: 'b', text: 'A component that controls other components' },
          { id: 'c', text: 'A component rendered only on the server' },
          { id: 'd', text: 'A component with no props' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'q7',
        question: 'What does useContext help you avoid?',
        options: [
          { id: 'a', text: 'Writing CSS' },
          { id: 'b', text: 'Prop drilling through many component levels' },
          { id: 'c', text: 'Using state entirely' },
          { id: 'd', text: 'Rendering lists' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q8',
        question: 'When does a functional component re-render by default?',
        options: [
          { id: 'a', text: 'Only when the page is refreshed' },
          { id: 'b', text: 'When its state or props change' },
          { id: 'c', text: 'Every second automatically' },
          { id: 'd', text: 'Never, unless forced manually' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q9',
        question: 'What is the purpose of the dependency array in useEffect?',
        options: [
          { id: 'a', text: 'It lists npm packages the component needs' },
          { id: 'b', text: 'It controls when the effect re-runs' },
          { id: 'c', text: 'It defines the component\u2019s props' },
          { id: 'd', text: 'It stores the component\u2019s CSS classes' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q10',
        question: 'Which of these is the correct way to update state based on its previous value?',
        options: [
          { id: 'a', text: 'setCount(count + 1)' },
          { id: 'b', text: 'count = count + 1' },
          { id: 'c', text: 'setCount(prevCount => prevCount + 1)' },
          { id: 'd', text: 'this.count++' },
        ],
        correctOptionId: 'c',
      },
    ],
  },
};

export default courseTests;