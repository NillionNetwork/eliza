# @elizaos/plugin-nillion

A plugin for storing and retrieving data from Nillion's nilDB within the ElizaOS ecosystem.

## Description
The Nillion plugin enables seamless integration with the decentralized nilDB
database backed by secure multi-party computation (MPC). The plugin provides
functionality to store and retrieve secrets to/from nilDB.

## Installation

```bash
pnpm install @elizaos/plugin-nillion
```

## Configuration

The plugin requires the following environment variables to be set:
```typescript
NILLION_PRIVATE_KEY=<Private key for transactions>
```

## Usage

### Basic Integration

```typescript
import { nillionPlugin } from '@ai16z/plugin-nillion';
```


### Store Secret Example

```typescript
// The plugin automatically handles secret uploads when triggered
// through natural language commands like:

"Upload my document.pdf"
"Store this image.png on nillion's database"
"Save my resume.docx to nilDB"
```


## API Reference

### Actions

#### NILLION_STORE

Uploads secrets to Nillion's nilDB.

**Aliases:**
- UPLOAD_SECRET_TO_NILLION
- UPLOAD_SECRET_TO_NILDB
- STORE_SECRET_ON_NILLION
- STORE_SECRET_ON_NILDB
- SAVE_SECRET_TO_NILLION
- SAVE_SECRET_TO_NILDB
- UPLOAD_TO_NILLION
- UPLOAD_TO_NILDB
- STORE_ON_NILLION
- STORE_ON_NILDB
- SHARE_SECRET_ON_NILLION
- SHARE_SECRET_ON_NILDB
- PUBLISH_SECRET_TO_NILLION
- PUBLISH_SECRET_TO_NILDB

**Input Content:**
```typescript
interface UploadContent {
    filePath: string;
}
```


## Common Issues & Troubleshooting

1. **File Access Errors**
   - Ensure the file exists at the specified path
   - Check file permissions
   - Verify the path is absolute or relative to the execution context

2. **Configuration Issues**
   - Verify all required environment variables are set
   - Ensure RPC endpoints are accessible
   - Confirm private key has sufficient permissions

## Security Best Practices

1. **Environment Variables**
   - Never commit private keys to version control
   - Use secure environment variable management
   - Rotate private keys periodically


## Development Guide

### Setting Up Development Environment

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Build the plugin:

```bash
pnpm run build
```

4. Run the plugin:

```bash
pnpm run dev
```

## Future Enhancements

1. **Storage Management**
   - Multi-file upload optimization
   - Folder structure preservation
   - Automated file replication
   - Storage redundancy management
   - File versioning system
   - Archival storage options

2. **Content Distribution**
   - CDN integration
   - Bandwidth optimization
   - Geographic replication
   - Edge caching support
   - P2P content delivery
   - Streaming optimization

3. **Data Security**
   - Enhanced encryption options
   - Access control lists
   - Key management system
   - Data integrity verification
   - Secure sharing mechanisms
   - Privacy-preserving features

4. **Integration Features**
   - Additional blockchain support
   - Cross-chain functionality
   - Smart contract integration
   - NFT storage optimization
   - DApp integration tools
   - API expansion

5. **Performance Optimization**
   - Upload speed improvements
   - Parallel processing
   - Compression algorithms
   - Caching mechanisms
   - Network optimization
   - Resource management

6. **Developer Tools**
   - Enhanced SDK features
   - CLI tool improvements
   - Testing framework
   - Monitoring dashboard
   - Analytics integration
   - Documentation generator

7. **Content Management**
   - Metadata management
   - Search functionality
   - Content indexing
   - Tag system
   - Collection management
   - Batch operations

8. **Protocol Features**
   - Model service deployment
   - KV store implementation
   - State persistence
   - Database integration
   - Enhanced file metadata
   - Protocol governance

We welcome community feedback and contributions to help prioritize these enhancements.

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## Credits

This plugin integrates with and builds upon several key technologies:
- [Nillion's NilDB](https://nillion.com/): Decentralized database

Special thanks to:
- The NilDB development team
- The Eliza community for their contributions and feedback

For more information about 0G capabilities:
- [NilDB Documentation](https://docs.0g.xyz/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Filecoin Docs](https://docs.filecoin.io/)
- [Flow Documentation](https://developers.flow.com/)

## License

This plugin is part of the Eliza project. See the main project repository for license information.

