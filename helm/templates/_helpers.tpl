{{- define "poozle.worker.image" -}}
  {{- if and .Values.worker.image.tagOverride  -}}
    {{- printf "%s/%s/%s:%s" .Values.worker.image.registry .Values.worker.image.repo .Values.worker.image.name .Values.worker.image.tagOverride }}
  {{- else -}}
    {{- printf "%s/%s/%s:%s" .Values.worker.image.registry .Values.worker.image.repo .Values.worker.image.name .Chart.AppVersion }}
  {{- end -}}
{{- end -}}

{{- define "poozle.server.image" -}}
  {{- if and .Values.server.image.tagOverride  -}}
    {{- printf "%s/%s/%s:%s" .Values.server.image.registry .Values.server.image.repo .Values.server.image.name .Values.server.image.tagOverride }}
  {{- else -}}
    {{- printf "%s/%s/%s:%s" .Values.server.image.registry .Values.server.image.repo .Values.server.image.name .Chart.AppVersion }}
  {{- end -}}
{{- end -}}

{{- define "poozle.temporal.image" -}}
  {{- if and .Values.temporal.image.tagOverride  -}}
    {{- printf "%s/%s/%s:%s" .Values.temporal.image.registry .Values.temporal.image.repo .Values.temporal.image.name .Values.temporal.image.tagOverride }}
  {{- else -}}
    {{- printf "%s/%s/%s:%s" .Values.temporal.image.registry .Values.temporal.image.repo .Values.temporal.image.name .Chart.AppVersion }}
  {{- end -}}
{{- end -}}