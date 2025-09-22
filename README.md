![Logo](https://s3.devantage.com.br/devantage-public/logo-100x100.png)

# n8n-nodes-word-docx-metadata-extractor

This is an n8n community node. It extracts available metadata information from Word DOCX files.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Compatibility](#compatibility)  
[Usage](#usage)
[Resources](#resources)  
[Version history](#version-history) 

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. The published package's name is: `@devantage/n8n-nodes-word-docx-metadata-extractor`

## Operations

This node has only a single operation that require a valid Word DOCX binary as input and extracts it's metadata information providing the result on output. The currently available information are:

- Title
- Subject
- Description
- Creator
- Creation datetime
- Last modifier
- Last modification datetime
- Revision number
- Pages count
- Words count

## Compatibility

The current version is compatible with n8n installations above v1.0.0.

## Usage

Provide a valid Word DOCX file binary as input for the node and it will extract and output the available metadata.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## Version history

- 1.0.0 - First release
