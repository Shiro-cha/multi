📡 multi

multi is a TypeScript-based tool built with Bun that facilitates multicast search operations across multiple clients. It operates without a traditional CLI interface, focusing on modularity and scalability for real-time querying.
🚀 Features

    Multicast Search: Perform search operations across multiple clients simultaneously.

    Modular Architecture: Easily extend functionality through a context-based system.

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

    bun run client/Ar.ts

    Compile to JavaScript:

    bun compile

    Compile and Run:

    bun cli

    Run as Daemon:

    bun daemon

These commands initiate the multicast search operations as defined in your contexts.
bun.sh
📁 Project Structure

    contexts/: Contains modules responsible for handling different contexts of the application.

    clients/: Holds client-side scripts for initiating search operations.

    core/: Core functionalities and utilities used across the application.

    controllers/: Modules that manage the flow of data and control logic.

    services/: Contains services that handle business logic and data processing.

    README.md: Project documentation.
    bun.sh+5Medium+5bun.sh+5

🧩 Extending Functionality

The modular architecture allows for easy integration of new contexts. To add a new context:

    Create a new file in the contexts/ directory.

    Export a function that defines the context's behavior.

    Register the context in the main application.

📄 License

This project is licensed under the MIT License.
