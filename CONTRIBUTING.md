# Contributing to SecureAI Inspector

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

- Be respectful and inclusive
- No harassment or discrimination
- Report issues to maintainers

## Getting Started

### Development Setup

1. **Fork the repository**
```bash
gh repo fork yourusername/secure-ai-inspector --clone
cd secure-ai-inspector
```

2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Install and run**
```bash
npm install
npm run dev
```

4. **Make your changes**
- Follow the code style
- Write clear commit messages
- Add comments for complex logic

5. **Test your changes**
```bash
npm run type-check
npm run lint
npm run build
```

6. **Commit and push**
```bash
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

7. **Create a Pull Request**
- Describe what changed
- Link related issues
- Request review

## Project Structure

```
secure-ai-inspector/
├── app/              # Next.js app directory
├── components/       # React components
├── types/           # TypeScript types
├── lib/             # Utilities
├── public/          # Static files
└── ...
```

## Code Style

### TypeScript
- Use strict mode: `"strict": true`
- Add explicit type annotations
- No implicit `any` types

### React Components
- Use functional components
- Export named components
- Add JSDoc comments

### Formatting
```bash
npm run lint --fix
```

## Commit Messages

Format: `type(scope): subject`

Examples:
- `feat(scan): add new security check`
- `fix(api): handle network timeout`
- `docs(readme): update installation steps`
- `refactor(components): simplify dashboard`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation
- `style`: Formatting
- `test`: Tests
- `chore`: Build, deps, etc.

## Pull Request Guidelines

### Before Submitting

- [ ] Tests pass: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Changes are well-documented
- [ ] Commit messages are clear
- [ ] No hardcoded secrets

### PR Template

```markdown
## Description
Briefly describe the changes

## Related Issues
Fixes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested the changes

## Screenshots (if applicable)
Add screenshots or videos

## Checklist
- [ ] Tests pass
- [ ] No console errors
- [ ] Documentation updated
- [ ] Code follows style guide
```

## Reporting Bugs

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120
- OS: Windows 11
- Node version: 18.17
```

## Feature Requests

### Feature Request Template

```markdown
## Description
What feature do you want?

## Motivation
Why is this useful?

## Proposed Solution
How should it work?

## Examples
Show example usage

## Alternatives
Other solutions considered
```

## Development Workflow

### Local Development

```bash
# Start dev server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Building
npm run build

# Full test
npm run build && npm run type-check && npm run lint
```

### Debugging

```bash
# Debug in VS Code
# Add to .vscode/launch.json
{
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "attach",
      "skipFiles": ["<node_internals>/**"],
      "protocol": "inspector"
    }
  ]
}

# Run with inspector
node --inspect-brk node_modules/.bin/next dev
```

### Adding Dependencies

```bash
# Add production dependency
npm install package-name

# Add dev dependency
npm install --save-dev package-name

# Check for vulnerabilities
npm audit

# Update packages
npm update
npm audit fix
```

## Testing

### Manual Testing

1. Test all user flows
2. Test error handling
3. Test on different browsers
4. Test on mobile devices

### Edge Cases to Test

- Empty input
- Invalid URLs
- Network timeouts
- Very large responses
- API failures
- Missing headers

## Documentation

### Update README.md if you:
- Add new features
- Change configuration
- Add new environment variables

### Update INSTALLATION.md if you:
- Change setup process
- Add new dependencies
- Change requirements

### Update DEPLOYMENT.md if you:
- Change deployment process
- Add new platforms

## Areas for Contribution

### High Priority
- [ ] Security scanning enhancements
- [ ] AI explanation improvements
- [ ] Error handling
- [ ] Performance optimization

### Medium Priority
- [ ] UI/UX improvements
- [ ] Documentation
- [ ] Testing
- [ ] Accessibility

### Nice to Have
- [ ] Internationalization (i18n)
- [ ] Dark/light theme toggle
- [ ] Advanced analytics
- [ ] Browser extensions

## Review Process

1. **Automated Checks**
   - Tests must pass
   - No TypeScript errors
   - Linting passes

2. **Code Review**
   - At least one approval
   - No requested changes

3. **Merge**
   - Squash and merge commits
   - Delete feature branch
   - Add to changelog

## Recognizing Contributions

Contributors are recognized in:
- GitHub contributors page
- CONTRIBUTORS.md file
- Release notes

## Questions or Need Help?

- Check existing issues and discussions
- Create a new discussion
- Ask in pull request comments
- Email maintainers

## License

By contributing, you agree your code will be under MIT License.

---

**Happy Contributing! 🚀**
