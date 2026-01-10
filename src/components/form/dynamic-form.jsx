// src/components/DynamicForm.jsx
import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, X, ChevronDown, ChevronUp, Edit2 } from 'lucide-react';
import Toast from '../ui/toast';
import { useSelector } from 'react-redux';
import { selectThemeMode, selectCurrentTheme } from '../../store/slices/theme-slice';

/**
 * DynamicForm Component
 * A reusable form component that can render any type of form based on configuration
 * Supports three modes: create, edit, and view
 * 
 * @param {Object} props
 * @param {Object} props.config - Form configuration object
 * @param {string} props.config.title - Form title
 * @param {string} props.config.subtitle - Form subtitle
 * @param {string} props.config.mode - Form mode: 'create', 'edit', or 'view'
 * @param {Array} props.config.sections - Array of form sections
 * @param {Object} props.config.initialData - Initial form data
 * @param {Function} props.onSubmit - Submit handler function
 * @param {Function} props.onCancel - Cancel handler function
 * @param {Function} props.onEdit - Edit handler function (for view mode)
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.showBackButton - Show back button
 * @param {string} props.submitLabel - Custom submit button label
 * @param {string} props.cancelLabel - Custom cancel button label
 */

// Helper function - MUST be defined before component
const getDefaultValueByType = (type) => {
  switch (type) {
    case 'checkbox': return false;
    case 'number': return '';
    case 'select': return '';
    case 'radio': return '';
    default: return '';
  }
};

const DynamicForm = ({
  config,
  onSubmit, 
  onCancel,
  onEdit,
  loading = false,
  showBackButton = true,
  submitLabel = 'Save',
  cancelLabel = 'Cancel'
}) => {
  const isViewMode = config.mode === 'view';
  const isEditMode = config.mode === 'edit';
  const isCreateMode = config.mode === 'create';
  const isDarkMode = useSelector(selectThemeMode);
  const currentTheme = useSelector(selectCurrentTheme);

  // Initialize form data with default values from config or empty
  const [formData, setFormData] = useState(() => {
    const data = {};
    config.sections?.forEach(section => {
      section.fields?.forEach(field => {
        const defaultValue = config.initialData?.[field.name] || 
                           field.defaultValue || 
                           getDefaultValueByType(field.type);
        data[field.name] = defaultValue;
      });
    });
    return data;
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Initialize all sections as expanded (open) by default
  const [expandedSections, setExpandedSections] = useState(() => {
    const expanded = {};
    config.sections?.forEach((section, index) => {
      expanded[section.id || index] = true;
    });
    return expanded;
  });
  
  const [toastState, setToastState] = useState({ isVisible: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(loading);

  // Toggle section expansion
  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle field change
  const handleFieldChange = (fieldName, value) => {
    if (isViewMode) return; // Prevent changes in view mode

    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));

    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  // Handle array field change (for repeatable sections)
  const handleArrayFieldChange = (fieldName, index, value) => {
    if (isViewMode) return;
    const currentArray = formData[fieldName] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [fieldName]: newArray
    }));
  };

  // Add new item to array field
  const handleAddArrayItem = (fieldName, defaultValue) => {
    if (isViewMode) return;
    const currentArray = formData[fieldName] || [];
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...currentArray, defaultValue || {}]
    }));
  };

  // Remove item from array field
  const handleRemoveArrayItem = (fieldName, index) => {
    if (isViewMode) return;
    const currentArray = formData[fieldName] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [fieldName]: newArray
    }));
  };

  // Validate form
  const validateForm = () => {
    if (isViewMode) return true; // Skip validation in view mode

    const newErrors = {};
    
    config.sections?.forEach(section => {
      section.fields?.forEach(field => {
        const value = formData[field.name];
        
        if (field.required && !value && value !== 0 && value !== false) {
          newErrors[field.name] = field.errorMessage || `${field.label} is required`;
        }
        
        if (field.validate && value) {
          const validationResult = field.validate(value, formData);
          if (validationResult && typeof validationResult === 'string') {
            newErrors[field.name] = validationResult;
          }
        }
        
        if (field.pattern && value && !field.pattern.test(value)) {
          newErrors[field.name] = field.patternMessage || `Invalid ${field.label.toLowerCase()}`;
        }
        
        if (field.type === 'number' && value !== '') {
          if (field.min !== undefined && Number(value) < field.min) {
            newErrors[field.name] = field.minMessage || `Minimum value is ${field.min}`;
          }
          if (field.max !== undefined && Number(value) > field.max) {
            newErrors[field.name] = field.maxMessage || `Maximum value is ${field.max}`;
          }
        }
        
        if ((field.type === 'text' || field.type === 'textarea') && value) {
          if (field.minLength && value.length < field.minLength) {
            newErrors[field.name] = field.minLengthMessage || `Minimum ${field.minLength} characters required`;
          }
          if (field.maxLength && value.length > field.maxLength) {
            newErrors[field.name] = field.maxLengthMessage || `Maximum ${field.maxLength} characters allowed`;
          }
        }
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (isViewMode) return;

    if (!validateForm()) {
      setToastState({ 
        isVisible: true, 
        message: 'Please fill all required fields', 
        type: 'error' 
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit?.(formData);
      setToastState({ 
        isVisible: true, 
        message: 'Successfully saved!', 
        type: 'success' 
      });
    } catch (error) {
      setToastState({ 
        isVisible: true, 
        message: error?.message || 'Error saving form', 
        type: 'error' 
      });
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else if (config.showBackButton !== false && showBackButton) {
      window.history.back();
    }
  };

  // Handle edit button click (view mode)
  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    }
  };

  // Render field value in view mode
  const renderViewValue = (field, value) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground italic">Not specified</span>;
    }

    switch (field.type) {
      case 'select':
        const selectedOption = field.options?.find(opt => opt.value === value);
        return <span className="text-foreground">{selectedOption?.label || value}</span>;

      case 'radio':
        const selectedRadio = field.options?.find(opt => opt.value === value);
        return <span className="text-foreground">{selectedRadio?.label || value}</span>;

      case 'checkbox':
        return (
          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
            value ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary/20 text-secondary-foreground border border-border'
          }`}>
            {value ? 'Yes' : 'No'}
          </span>
        );

      case 'number':
        return <span className="text-foreground">{value}</span>;

      case 'textarea':
        return <p className="text-foreground whitespace-pre-wrap">{value}</p>;

      case 'date':
      case 'datetime-local':
      case 'time':
        return <span className="text-foreground">{value}</span>;

      case 'custom':
        if (field.renderView) {
          return field.renderView(value, formData);
        }
        return <span className="text-foreground">{String(value)}</span>;

      default:
        return <span className="text-foreground">{value}</span>;
    }
  };

  // Render field based on type
  const renderField = (field) => {
    const value = formData[field.name];
    const error = errors[field.name];
    const isTouched = touched[field.name];
    const showError = isTouched && error;
    const isDisabled = loading || field.disabled || isViewMode;
    const isReadOnly = field.readOnly || isViewMode;

    // In view mode, render as read-only display
    if (isViewMode) {
      return (
        <div className="py-1">
          {renderViewValue(field, value)}
        </div>
      );
    }

    const baseInputClass = `w-full px-3 py-2.5 bg-input border ${showError ? 'border-destructive' : 'border-border'} rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    const fieldProps = {
      name: field.name,
      value: value || '',
      onChange: (e) => handleFieldChange(field.name, e.target.value),
      placeholder: field.placeholder,
      disabled: isDisabled,
      readOnly: isReadOnly,
      className: baseInputClass,
      onBlur: () => setTouched(prev => ({ ...prev, [field.name]: true }))
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'url':
        return (
          <input
            type={field.type}
            {...fieldProps}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...fieldProps}
            rows={field.rows || 4}
            maxLength={field.maxLength}
          />
        );

      case 'select':
        return (
          <select {...fieldProps}>
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={field.name}
              checked={!!value}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              disabled={isDisabled}
              className="w-4 h-4 rounded border-border bg-input text-foreground focus:ring-2 focus:ring-primary"
            />
            <label htmlFor={field.name} className="text-sm text-foreground">
              {field.label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-card rounded transition-colors">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  disabled={isDisabled}
                  className="w-4 h-4 border-border bg-input text-foreground focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-foreground">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
      case 'datetime-local':
      case 'time':
      case 'month':
        return <input type={field.type} {...fieldProps} />;

      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="file"
              onChange={(e) => handleFieldChange(field.name, e.target.files)}
              disabled={isDisabled}
              accept={field.accept}
              multiple={field.multiple}
              className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
            />
            {field.multiple && (
              <p className="text-xs text-muted-foreground">Multiple files can be selected</p>
            )}
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              {...fieldProps}
              className="w-10 h-10 cursor-pointer"
            />
            <span className="text-sm text-foreground">{value}</span>
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              {...fieldProps}
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              className="w-full h-2 bg-[#2d2d2d] rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{field.min || 0}</span>
              <span className="font-medium">{value}</span>
              <span>{field.max || 100}</span>
            </div>
          </div>
        );

      case 'custom':
        return field.render?.(value, (newValue) => handleFieldChange(field.name, newValue), formData);

      default:
        return <input type="text" {...fieldProps} />;
    }
  };

  // Render array section (repeatable fields)
  const renderArraySection = (section) => {
    const arrayData = formData[section.arrayField] || [];
    const showSection = !section.condition || section.condition(formData);

    if (!showSection) return null;

    return (
      <div className="space-y-3 sm:space-y-4">
        {arrayData.map((item, index) => (
          <div key={index} className="bg-card p-3 sm:p-4 rounded-lg border border-border space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-foreground">
                {section.itemLabel || 'Item'} {index + 1}
              </h4>
              {!isViewMode && (
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem(section.arrayField, index)}
                  disabled={loading}
                  className="text-destructive hover:opacity-80 transition-colors p-1 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {section.fields?.map((field, fieldIndex) => (
                <div key={fieldIndex}>
                  {field.label && (
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">
                      {field.label}
                      {field.required && !isViewMode && <span className="text-destructive ml-1">*</span>}
                    </label>
                  )}
                  {renderField({
                    ...field,
                    name: `${section.arrayField}[${index}].${field.name}`
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {!isViewMode && (
          <button
            type="button"
            onClick={() => handleAddArrayItem(section.arrayField, section.defaultItem || {})}
            disabled={loading}
            className="w-full py-2.5 border border-dashed border-border rounded-lg text-foreground hover:bg-card transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {section.addButtonLabel || 'Add Item'}
          </button>
        )}
      </div>
    );
  };

  // Render a single section
  const renderSection = (section, sectionIndex) => {
    const sectionId = section.id || sectionIndex;
    const isExpanded = expandedSections[sectionId];
    const showSection = !section.condition || section.condition(formData);

    if (!showSection) return null;

    return (
      <div key={sectionId} className="bg-card rounded-lg border border-border overflow-hidden">
        {(section.title || section.description) && (
          <div 
            className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-border bg-card cursor-pointer hover:opacity-90 transition-colors"
            onClick={() => toggleSection(sectionId)}
          >
            <div className="flex justify-between items-center">
              <div>
                {section.title && (
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">
                    {section.title}
                  </h3>
                )}
                {section.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {section.description}
                  </p>
                )}
              </div>
              <div className="text-muted-foreground">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="p-3 sm:p-4 md:p-5 lg:p-6">
            {section.type === 'array' ? (
              renderArraySection(section)
            ) : (
              <div className={`grid ${section.gridCols || 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'} gap-3 sm:gap-4 md:gap-5 lg:gap-6`}>
                {section.fields?.map((field, fieldIndex) => {
                  const showField = !field.condition || field.condition(formData);
                  if (!showField) return null;

                  // Check if field should be hidden in view mode
                  if (isViewMode && field.hideInView) return null;

                  return (
                    <div 
                      key={fieldIndex} 
                      className={field.fullWidth ? 'col-span-1 md:col-span-2 xl:col-span-3' : ''}
                    >
                      {field.type !== 'checkbox' && field.label && (
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">
                          {field.label}
                          {field.required && !isViewMode && <span className="text-destructive ml-1">*</span>}
                        </label>
                      )}
                      
                      {renderField(field)}
                      
                      {errors[field.name] && touched[field.name] && !isViewMode && (
                        <p className="text-destructive text-xs mt-1">{errors[field.name]}</p>
                      )}
                      
                      {field.helperText && !errors[field.name] && !isViewMode && (
                        <p className="text-muted-foreground text-xs mt-1">{field.helperText}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Header */}
      <div className="border-b border-border bg-card z-40">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              {showBackButton && (
                <button
                  onClick={handleCancelClick}
                  className="p-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  {config.title || 'Form'}
                </h1>
                {config.subtitle && (
                  <p className="text-xs sm:text-sm mt-0.5 text-muted-foreground">
                    {config.subtitle}
                  </p>
                )}
              </div>
            </div>
            
          
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 full-w-[1600px] mx-auto pt-4 sm:pt-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            {config.sections?.map((section, index) => renderSection(section, index))}
          </form>
        </div>
      </div>

      {/* Floating Action Buttons - Right Side Bottom */}
      <div className="fixed bottom-6 right-20 z-50 flex flex-row gap-3">
        {isViewMode ? (
          <>
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-5 py-3 rounded-lg transition-all shadow-lg font-medium flex items-center gap-2 bg-card border border-border text-foreground hover:bg-accent"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            {onEdit && (
              <button
                type="button"
                onClick={handleEditClick}
                className="px-5 py-3 rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90"
                title="Edit"
              >
                <Edit2 className="w-5 h-5" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCancelClick}
              disabled={isLoading}
              className="px-5 py-3 rounded-lg transition-all shadow-lg font-medium disabled:opacity-50 flex items-center gap-2 bg-card border border-border text-foreground hover:bg-accent"
              title="Cancel"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">{cancelLabel}</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-5 py-3 rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 bg-primary text-primary-foreground hover:opacity-90"
              title="Save"
            >
              <Save className="w-5 h-5" />
              <span className="hidden sm:inline">{isLoading ? 'Saving...' : submitLabel}</span>
            </button>
          </>
        )}
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastState.message}
        type={toastState.type}
        isVisible={toastState.isVisible}
        onClose={() => setToastState(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default DynamicForm;