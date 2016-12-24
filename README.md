# What is this?

A visual tool for looking up and filtering users of a Lithium community based on their email addresses, written in Elm and JavaScript and relying on the Community REST API v2. Ordinary users can use this tool to do administrator-level user lookups without needing access to administrator credentials and without being able to anything *else* as an administrator.

# Installation

```bash
git clone https://github.com/ryantriangles/li-lookup.git
cd li-lookup
npm install
elm-package install -y
npm run build
npm run start
```

# Configuration

`config.json` sets three options:

- The root URL of your Lithium community, e.g. `https://forums.example.com`;
- The username of any user who can make admin-level requests;
- The pasword of that user.
