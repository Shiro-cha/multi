export const choices = [
    {name:"e",description:"Edit user name"},
    {name:"c",description:"Create a query search"},
    {name:"r",description:"Resend all queries"},
    {name:"d",description:"Delete a query search"},
    {name:"i",description:"Display informations"},
    {name:"s",description:"Show all searchs"},
    {name:"q",description:"Quit"}
];
export const questions =  [
    {
      type: 'text',
      name: 'choice',
      message: 'What do you want to do ?'
    },
  ];
export const edits = [
  {
    type: 'text',
    name: 'username',
    message: 'What is your new name ?'
  },
  {
    type: (prev:string)=>prev.trim()!==""?'toggle':null,
    name: 'confirmation',
    message: 'Can you confirm ?',
    initial: true,
    active: 'yes',
  inactive: 'no'
  }
];
export const news = [
  {
    type: 'text',
    name: 'name',
    message: 'What is the name of your search ?'
  },
  {
    type: (prev:string)=>prev.toString().trim()!==""?'list':null,
    name: 'keys',
    message: 'Enter keywords',
    initial: '',
    separator: ','
  },
  {
    type: (prev:string)=>prev.toString().trim()!==""?'select':null,
    name: 'extension',
    message: 'What is the file extension ?',
    choices: [
      { title: 'Audio', value: '.mp3' },
      { title: 'Video', value: '.mp4'},
      { title: 'Document', value: '.pdf' }
    ],
    initial: 1
  },
  {
    type: (prev:string)=>prev.toString().trim()!==""?'toggle':null,
    name: 'confirmation',
    message: 'Can you confirm ?',
    initial: true,
    active: 'yes',
  inactive: 'no'
  }
]
export const renews = [
  {
    type: "toggle",
    name: 'confirmation',
    message: 'Do you really want to resend all searchs ?',
    initial: false,
    active: 'yes',
  inactive: 'no'
  }
]

export const deletions = (choices:{name:string,value:string}[])=>{return [
  {
  type:"select",
  name:"slug",
  message: 'What search do you want to delete ?',
  choices: [...choices.map((choice)=>{return { title: choice.name, value: choice.value,description:choice.value}}),
            {title:"return",value:"undo",description:"Do nothing"}
          ],
  initial: 1
  },
  {
    type: (prev:string)=>prev!=="undo"?'toggle':null,
    name: 'cfm',
    message: 'Can you confirm deletion?',
    initial: false,
    active: 'yes',
  inactive: 'no'
  }
]}
export const delete_nothing = [
  {
    type: 'text',
    name: 'wanna_quit',
    message: 'Quit'
  }
]

export const infos =[
  {
    type: 'text',
    name: 'wanna_quit',
    message: 'Quit'
  }
]