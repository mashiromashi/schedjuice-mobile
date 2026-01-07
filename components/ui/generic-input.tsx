import React from 'react';
import { StyleSheet, View, TextInput, type TextInputProps } from 'react-native';
import { Eye, EyeClosed, type LucideIcon } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Icon } from './icon';
import { cn } from '@/lib/utils';

type GenericInputType = 'text' | 'password' | 'number' | 'email';

interface GenericInputProps
  extends Omit<TextInputProps, 'style' | 'secureTextEntry' | 'value' | 'onChangeText'> {
  label: string;
  placeholder?: string;
  icon?: LucideIcon | null;
  type?: GenericInputType;
  readonly?: boolean;
  value?: any;
  onChangeText?: (text: string) => void;
  onChange?: (value: any) => void;
  helperText?: string;
  errorText?: string;
  containerClassName?: string;
  inputClassName?: string;
  style?: TextInputProps['style'];
}

const GenericInput = React.forwardRef<TextInput, GenericInputProps>((props, ref) => {
  const {
    label,
    placeholder,
    icon,
    type = 'text',
    readonly = false,
    value,
    onChangeText,
    onChange,
    onBlur,
    helperText,
    errorText,
    containerClassName,
    inputClassName,
    style,
    autoCapitalize,
    keyboardType,
    editable,
    defaultValue,
    ...inputProps
  } = props;

  const [isSecureTextEntry, setIsSecureTextEntry] = React.useState(type === 'password');

  React.useEffect(() => {
    setIsSecureTextEntry(type === 'password');
  }, [type]);

  const handleChangeText = React.useCallback(
    (text: string) => {
      onChangeText?.(text);
      if (typeof onChange === 'function' && onChange !== onChangeText) {
        onChange(text);
      }
    },
    [onChange, onChangeText]
  );

  const hasControlledValue = value !== undefined && value !== null;

  const resolvedValue = hasControlledValue
    ? typeof value === 'string'
      ? value
      : String(value)
    : undefined;

  const resolvedDefaultValue =
    !hasControlledValue && defaultValue !== undefined && defaultValue !== null
      ? typeof defaultValue === 'string'
        ? defaultValue
        : String(defaultValue)
      : undefined;

  const resolvedKeyboardType =
    keyboardType ??
    (type === 'number' ? 'numeric' : type === 'email' ? 'email-address' : undefined);

  const resolvedEditable = editable ?? !readonly;

  return (
    <View style={styles.container} className={containerClassName}>
      {label ? (
        <Text style={styles.label} className="text-secondary dark:text-foreground">
          {label}
        </Text>
      ) : null}

      <View
        style={styles.inputWrapper}
        className={cn(
          'rounded-xl border border-border bg-white dark:bg-background',
          errorText ? 'border-destructive' : null
        )}>
        {icon ? (
          <View style={styles.iconContainer}>
            <Icon as={icon} size={20} />
          </View>
        ) : null}

        <Input
          ref={ref}
          value={resolvedValue}
          defaultValue={resolvedDefaultValue}
          onChangeText={handleChangeText}
          onBlur={onBlur}
          autoCapitalize={autoCapitalize ?? 'none'}
          secureTextEntry={type === 'password' && isSecureTextEntry}
          placeholder={placeholder}
          style={[styles.textInputStyle, style]}
          className={cn('', inputClassName)}
          editable={resolvedEditable}
          keyboardType={resolvedKeyboardType}
          {...inputProps}
        />
        {type === 'password' ? (
          <View style={styles.iconContainer}>
            {isSecureTextEntry ? (
              <EyeClosed size={20} onPress={() => setIsSecureTextEntry(false)} />
            ) : (
              <Eye size={20} onPress={() => setIsSecureTextEntry(true)} />
            )}
          </View>
        ) : null}
      </View>

      {helperText && !errorText ? (
        <Text className="mt-1 text-xs text-muted-foreground">{helperText}</Text>
      ) : null}
      {errorText ? <Text className="mt-1 text-xs text-destructive">{errorText}</Text> : null}
    </View>
  );
});

GenericInput.displayName = 'GenericInput';

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  textInputStyle: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingHorizontal: 0,
    borderColor: 'transparent',
  },
});

export default GenericInput;
