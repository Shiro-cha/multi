📡 multi

multi is a TypeScript-based tool built with Bun that facilitates multicast search operations across multiple clients. It operates without a traditional CLI interface, focusing on modularity and scalability for real-time querying.
🚀 Features

    Multicast Search: Perform search operations across multiple clients simultaneously.

    Modular Architecture: Easily extend functionality through a plugin-based system.

    Real-time Querying: Receive instant search results from connected clients.

🛠️ Installation

Ensure you have Bun installed on your system.

bun install

⚙️ Usage

Currently, multi does not provide a command-line interface. To utilize its functionality:

    Clone the Repository:

    git clone https://github.com/Shiro-cha/multi.git
    cd multi

Run the Application:



```bash
bun run client/Ar.ts
```

To compile to Javascript:

```bash
bun compile
```

To compile and run:

```bash
bun cli
```

To run as daemon:

```bash
bun daemon
```
📁 Project Structure

    src/: Contains the source code organized into modules.

    plugins/: Directory for modular plugins to extend functionality.

    README.md: Project documentation.

🧩 Extending Functionality

The modular architecture allows for easy integration of plugins. To add a new plugin:

    Create a new file in the plugins/ directory.

    Export a function that defines the plugin's behavior.

    Register the plugin in the main application.
