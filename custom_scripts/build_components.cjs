const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const buildComponents = async () => {
  const iconsDir = path.join(__dirname, '../src/icons');
  const files = await readdir(iconsDir);
  const iconFiles = files.filter((file) => file.endsWith('.svg'));

  const componentsDir = path.join(__dirname, '../src/components');
  if (!fs.existsSync(componentsDir)) {
    await promisify(fs.mkdir)(componentsDir);
  }

  iconFiles.forEach((file) => {
    const fileName = file.replace('.svg', '');
    const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
    const componentPath = path.join(componentsDir, `${componentName}.tsx`);

    const svgContent = readFile(path.join(iconsDir, file), 'utf8');
    const componentContent = `
import React from 'react';

interface ${componentName}Props {
  size?: number | string;
  color?: string;
  viewBox?: string;
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

const ${componentName} = ({
  size = 24,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  className,
  style,
  ...props
}: ${componentName}Props) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill={color}
    className={className}
    style={style}
    {...props}
  >
    ${svgContent}
  </svg>
);

export default ${componentName};
`;
    writeFile(componentPath, componentContent, 'utf8');
  });
};

buildComponents();