# Contributing to Scanner Bridge

Thank you for your interest in contributing to Scanner Bridge! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/scanner-bridge.git
   cd scanner-bridge
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Backend Development

1. **Make Changes**
   - Edit files in `backend/` directory
   - Follow Python PEP 8 style guide

2. **Test Changes**
   ```bash
   cd backend
   pytest tests/
   ```

3. **Run Backend**
   ```bash
   python app.py
   ```

### Frontend Development

1. **Make Changes**
   - Edit files in `frontend/src/` directory
   - Follow React and TypeScript best practices

2. **Run Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Type Check**
   ```bash
   npm run type-check
   ```

4. **Lint Code**
   ```bash
   npm run lint
   ```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build, dependencies, etc.

### Examples

```
feat(scanner): add support for network scanners

- Implement network scanner detection
- Add network scanner configuration
- Update documentation

Closes #123
```

```
fix(frontend): prevent WebSocket reconnection loop

- Add exponential backoff for reconnection attempts
- Fix connection state management
- Add tests for reconnection logic
```

## Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Update API docs if endpoints changed
   - Add comments for complex logic

2. **Add Tests**
   - Write tests for new features
   - Ensure existing tests pass
   - Aim for >80% code coverage

3. **Create Pull Request**
   - Clear description of changes
   - Reference related issues
   - Include screenshots for UI changes

4. **Code Review**
   - Address review comments
   - Push updates to same branch
   - Maintainers will merge when approved

## Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v
pytest tests/ --cov=. --cov-report=html
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing

1. **Scanner Detection**
   - Verify scanners are detected
   - Test with multiple scanners
   - Test with no scanners connected

2. **Scan Operations**
   - Test different formats (JPEG, PNG, TIFF)
   - Test different resolutions
   - Test different color modes

3. **Image Processing**
   - Test format conversion
   - Test image optimization
   - Test error handling

4. **WebSocket**
   - Test real-time updates
   - Test reconnection
   - Test error handling

## Documentation

### Code Comments

- Use clear, concise comments
- Explain "why", not "what"
- Update comments when code changes

### Docstrings

**Python:**
```python
def start_scan(self, scanner_id: str, params: Dict[str, Any]) -> str:
    """
    Start a scan operation.
    
    Args:
        scanner_id: ID of scanner to use
        params: Scan parameters (format, resolution, etc.)
        
    Returns:
        Scan ID for tracking the operation
        
    Raises:
        ValueError: If scanner not found
    """
```

**TypeScript:**
```typescript
/**
 * Start a scan operation
 * @param scannerId - ID of scanner to use
 * @param params - Scan parameters
 * @returns Promise with scan result
 */
async function startScan(scannerId: string, params?: any): Promise<any>
```

### README Updates

- Update README.md for user-facing changes
- Update README_AR.md for Arabic documentation
- Keep documentation in sync with code

## Code Style

### Python

- Follow PEP 8
- Use type hints
- Use meaningful variable names
- Max line length: 100 characters

```python
def get_scanner_info(self, scanner_id: str) -> Optional[Dict[str, Any]]:
    """Get detailed information about a scanner."""
    if scanner_id not in self.scanners:
        return None
    return asdict(self.scanners[scanner_id])
```

### TypeScript/React

- Use TypeScript for type safety
- Use functional components
- Use hooks for state management
- Use meaningful component names

```typescript
interface Props {
  scanners: Scanner[]
  currentScanner: Scanner | null
}

export default function ScannerSelector({ scanners, currentScanner }: Props) {
  // Component implementation
}
```

## Performance Guidelines

### Backend

- Use async operations for I/O
- Cache frequently accessed data
- Optimize image processing
- Monitor memory usage

### Frontend

- Use React.memo for expensive components
- Lazy load components
- Optimize re-renders
- Use WebSocket for real-time updates

## Security Guidelines

- Validate all inputs
- Sanitize file paths
- Use HTTPS in production
- Limit CORS origins
- Don't expose sensitive information in errors

## Reporting Issues

### Bug Reports

Include:
- Operating system and version
- Scanner model and driver
- Steps to reproduce
- Expected vs actual behavior
- Error messages and logs
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of feature
- Use cases and benefits
- Proposed implementation
- Alternative approaches considered

## Review Process

1. **Automated Checks**
   - Tests must pass
   - Code style must be correct
   - No security issues

2. **Code Review**
   - At least one maintainer review
   - All comments addressed
   - Approval required

3. **Merge**
   - Squash commits if needed
   - Merge to main branch
   - Close related issues

## Release Process

1. **Version Bump**
   - Update version in package.json
   - Update version in app.py
   - Update CHANGELOG.md

2. **Testing**
   - Run full test suite
   - Manual testing on all platforms
   - Test Docker build

3. **Release**
   - Create GitHub release
   - Tag commit with version
   - Update documentation

## Resources

- [Python PEP 8 Style Guide](https://www.python.org/dev/peps/pep-0008/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Git Documentation](https://git-scm.com/doc)

## Questions?

- Check existing issues and discussions
- Ask in GitHub discussions
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Scanner Bridge! Your efforts help make this project better for everyone.
