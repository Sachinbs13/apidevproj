import { getSelectClassName } from '../../constants/formStyles.js';
import { cn } from '../../utils/cn.js';

function Select({ variant = 'default', className, ...props }) {
  return <select className={cn(getSelectClassName(variant), className)} {...props} />;
}

export default Select;
